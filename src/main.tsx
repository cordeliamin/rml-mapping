import { ChakraProvider, withDefaultProps } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { extendTheme } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const theme = extendTheme(
  withDefaultProps({
    defaultProps: {
      padding: "6px",
    },
    components: ["GridItem"],
  })
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
