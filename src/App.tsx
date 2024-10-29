// import './App.css'
import { Grid, GridItem, Box } from '@chakra-ui/react'
import initialGraph from './initialGraph.json';
import MappingPane from './MappingPane';
import UploadPane from './UploadPane';
import { useState } from 'react';

export type Category = 'abstract-values' | 'realized-goals'
  | 'undesirable-properties' | 'interventions' | 'known-assumptions';

export interface Edge {
  "source": string,
  "targets": string[],
}

export type GraphData = {
  [key in Category]: string[];
} & {
  "edges": Edge[],
};

function App() {
  const [graphData, setGraphData] = useState<GraphData>(initialGraph);

  return (
    <Box
      display="grid"
      height="100vh"
      width="100vw"
    >
      <Grid
        templateAreas={`"header header"
                  "upload-pane mapping-pane"
                  "footer footer"`}
        gridTemplateRows={'80px 1fr 40px'}
        gridTemplateColumns={'200px 1fr'}
        gap='1'
        color='blackAlpha.700'
        fontWeight='bold'
        height="100%"
        width="100%"
      >
        <GridItem pl='2' bg='orange.300' area={'header'}>
          Header
        </GridItem>
        <GridItem pl='2' bg='pink.300' area={'upload-pane'}>
          <UploadPane setGraphData={setGraphData} />
        </GridItem>
        <GridItem pl='2' bg='green.300' area={'mapping-pane'}>
          <MappingPane graphData={graphData} />
        </GridItem>
        <GridItem pl='2' bg='blue.300' area={'footer'}>
          Footer
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App
