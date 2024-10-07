import CytoscapeComponent from 'react-cytoscapejs';
import { GraphData } from './App';

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

function MappingPane: React.FC<MappingPaneProps>({ graphData: GraphData }) {
  const elements = [
    { data: { id: 'n1', label: 'Node 1' }, position: { x: 0, y: 0 } },
    { data: { id: 'n2', label: 'Node 2' }, position: { x: 0, y: 100 } },
    { data: { id: 'n3', label: 'Node 3' }, position: { x: 0, y: 100 } },
    { data: { source: 'n1', target: 'n2', label: 'Edge from Node1 to Node2' }, },
    { data: { source: 'n1', target: 'n3', label: 'Edge from Node1 to Node3' }, },
  ];
  return (
    <CytoscapeComponent elements={elements} style={{ width: '100%', height: '100%' }} layout={layout} />
  );
}

export default MappingPane
