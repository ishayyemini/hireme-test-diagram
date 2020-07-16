import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Grommet, Box } from 'grommet'

import DiagramBody from './components/DiagramBody'

const Wrapper = styled(Box)`
  max-width: 100vw;
  max-height: 100vh;
`

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

const App = () => {
  return (
    <Grommet>
      <GlobalStyle />
      <Wrapper>
        <DiagramBody />
      </Wrapper>
    </Grommet>
  )
}

export default App
