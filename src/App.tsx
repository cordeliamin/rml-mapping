import './App.css'
import { Grid, GridItem, Box } from '@chakra-ui/react'

function App() {
  // const [count, setCount] = useState(0)

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
        gridTemplateRows={'50px 1fr 30px'}
        gridTemplateColumns={'1fr 3fr'}
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
          Nav
        </GridItem>
        <GridItem pl='2' bg='green.300' area={'mapping-pane'}>
          Main
        </GridItem>
        <GridItem pl='2' bg='blue.300' area={'footer'}>
          Footer
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App
