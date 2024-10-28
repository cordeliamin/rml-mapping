import CytoscapeComponent from 'react-cytoscapejs';
import { GraphData } from './App';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';

cytoscape.use(edgehandles);

interface MappingPaneProps {
  graphData: GraphData;
}

// const layout = {
//   name: 'dagre',
//   rankDir: 'TB', // Top-to-bottom direction
//   ranker: 'network-simplex',
//   rank: (node: NodeSingular) => {
//     const category = node.data("category");
//     if (category === 'known-assumptions') return 0; // Bottom-most layer
//     if (category === 'interventions') return 1;
//     if (category === 'undesirable-properties') return 2;
//     if (category === 'realized-goals') return 3;
//     if (category === 'abstract-values') return 4; // Top-most layer
//   },
// };

// Create cytoscape ElementDefinitions from the graph data
const parseGraphData = (graphData: GraphData): cytoscape.ElementDefinition[] => {
  const elements: cytoscape.ElementDefinition[] = [];

  const nodeCategories = [
    'abstract-values',
    'realized-goals',
    'undesirable-properties',
    'interventions',
    'known-assumptions',
  ];
  //
  // Categories and their corresponding y positions
  const categoryPositions: { [key: string]: number } = {
    'abstract-values': 100, // Top row
    'realized-goals': 200,
    'undesirable-properties': 300,
    'interventions': 400,
    'known-assumptions': 500, // Bottom row
  };

  nodeCategories.forEach(category => {
    let xPos = 0;
    const xSpacing = 150; // Space between nodes horizontally
    const values = graphData[category as keyof GraphData] as string[];
    values.forEach((value) => {
      elements.push({
        data: {
          id: value,
          label: value, // Optional label for nodes
          category: category
        },
        group: 'nodes', // Defines this element as a node
        position: {
          x: xPos,
          y: categoryPositions[category]
        },
      })
    });
    xPos += xSpacing;
  });

  // Create edges
  graphData.edges.forEach((edge) => {
    edge.targets.forEach((target) => {
      elements.push({
        data: {
          id: `edge-${edge.source}-${target}`, // Unique ID for each edge
          source: edge.source, // ID of the source node
          target: target, // ID of the target node
        },
        group: 'edges', // Defines this element as an edge
      });
    })
  });

  return elements;
};

const MappingPane: React.FC<MappingPaneProps> = ({ graphData }) => {
  const elements = parseGraphData(graphData);

  const initializeEdgeHandles = (cy: cytoscape.Core) => {
    const eh = cy.edgehandles({
      canConnect: function(sourceNode, targetNode) {
        return !sourceNode.same(targetNode); // Disallow self-loops
      },
      edgeParams: function(sourceNode, targetNode) {
        const edgeId = `edge-${sourceNode.id()}-${targetNode.id()}`;
        return {
          data: {
            id: edgeId,          // Unique ID for the edge
            source: sourceNode.id(),  // Source node ID
            target: targetNode.id()   // Target node ID
          },
          group: 'edges',  // Defines this element as an edge
        };
      },
      // TODO: get the edge handle dot to be visible on hover
      // handlePosition: function(node: NodeSingular) {
      //   return node.id() == "ka1" ? "top top" : "bottom bottom";
      // },
      // handleInDrawMode: true,
    });

    eh.enable(); // Enable edge handles
    eh.enableDrawMode();
    console.log('Edgehandles initialized');
  };

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100%', height: '100%' }}
      // userPanningEnabled={false}
      // userZoomingEnabled={false}
      // layout={layout}
      cy={(cy) => {
        initializeEdgeHandles(cy);
      }}
    />
  );
};

export default MappingPane;
