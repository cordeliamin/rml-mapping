import CytoscapeComponent from 'react-cytoscapejs';
import { Category, GraphData } from './App';
import cytoscape, { NodeSingular } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import dagre from 'cytoscape-dagre';

cytoscape.use(edgehandles);
cytoscape.use(dagre);

interface MappingPaneProps {
  graphData: GraphData;
}
const categoryRankMap: Record<Category, number> = {
  'abstract-values': 0,
  'realized-goals': 1,
  'undesirable-properties': 2,
  'interventions': 3,
  'known-assumptions': 4,
}

// Use the dagre layout for x positioning, but set y positions based on category
const layout = {
  name: 'dagre',
  transform: (node: NodeSingular, pos: cytoscape.Position) => {
    const nodeCategory = node.data("category") as Category;
    return {
      x: pos.x,
      y: (categoryRankMap[nodeCategory] + 1) * 100
    }
  }
};

const parseGraphData = (graphData: GraphData): cytoscape.ElementDefinition[] => {
  const elements: cytoscape.ElementDefinition[] = [];

  const nodeCategories: Category[] = [
    'abstract-values',
    'realized-goals',
    'undesirable-properties',
    'interventions',
    'known-assumptions',
  ];

  nodeCategories.forEach(category => {
    const values = graphData[category as keyof GraphData] as string[];
    values.forEach((value) => {
      elements.push({
        data: {
          id: value,
          label: value, // Optional label for nodes
          category: category
        },
        group: 'nodes', // Defines this element as a node
      })
    });
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
        // TODO: enforce edge connection rules
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
  };

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100%', height: '100%' }}
      userPanningEnabled={false}
      userZoomingEnabled={false}
      layout={layout}
      cy={(cy) => {
        initializeEdgeHandles(cy);
      }}
    />
  );
};

export default MappingPane;
