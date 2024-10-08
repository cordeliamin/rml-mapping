import CytoscapeComponent from 'react-cytoscapejs';
import { GraphData } from './App';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';

cytoscape.use(edgehandles);

interface MappingPaneProps {
  graphData: GraphData
}

const layout = {
  name: 'breadthfirst',

  fit: true, // whether to fit the viewport to the graph
  directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
  padding: 30, // padding on fit
  circle: false, // put depths in concentric circles if true, put depths top down if false
  grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
  spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  roots: "#n1", // the roots of the trees
  depthSort: undefined, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  // transform: function(node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
}

// Create cytoscape ElementDefinitions from the graph data
const parseGraphData = (graphData: GraphData): cytoscape.ElementDefinition[] => {
  const elements: cytoscape.ElementDefinition[] = [];

  // Create nodes for each category
  const nodeCategories = [
    { key: 'abstract-values', label: 'Abstract Value' },
    { key: 'realized-goals', label: 'Realized Goal' },
    { key: 'undesirable-properties', label: 'Undesirable Property' },
    { key: 'interventions', label: 'Intervention' },
    { key: 'known-assumptions', label: 'Known Assumption' }
  ];

  nodeCategories.forEach(category => {
    const values = graphData[category.key as keyof GraphData] as string[];
    values.forEach((value) => {
      elements.push({
        data: {
          id: value,
          label: value, // Optional label for nodes
        },
        group: 'nodes', // Defines this element as a node
      });
    });
  });

  // Create edges from the "edges" array
  graphData.edges.forEach((edge) => {
    elements.push({
      data: {
        id: `edge-${edge.source}-${edge.target}`, // Unique ID for each edge
        source: edge.source, // ID of the source node
        target: edge.target, // ID of the target node
      },
      group: 'edges', // Defines this element as an edge
    });
  });

  return elements;
};

let cyRef = cytoscape();
const eh = cyRef.edgehandles({
  canConnect: function(sourceNode, targetNode) {
    // whether an edge can be created between source and target
    return !sourceNode.same(targetNode); // e.g. disallow loops
  },
  edgeParams: function(sourceNode, targetNode) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    const edgeId = `edge-${sourceNode.id()}-${targetNode.id()}`;
    return {
      data: {
        id: edgeId,          // Unique ID for the edge
        source: sourceNode.id(),  // Source node ID
        target: targetNode.id()   // Target node ID
      },
      group: 'edges'  // Defines this element as an edge
    };
  },
});

eh.enable(); // Enable edge handles
eh.enableDrawMode();

const MappingPane: React.FC<MappingPaneProps> = ({ graphData }) => {
  const elements = parseGraphData(graphData);
  return (
    <CytoscapeComponent elements={elements} style={{ width: '100%', height: '100%' }} layout={layout} autoungrabify={true} userPanningEnabled={false} cy={(cy) => { cyRef = cy }} />
  );
}

export default MappingPane
