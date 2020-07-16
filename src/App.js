import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Grommet, Box } from 'grommet'

import DiagramBody from './components/DiagramBody'
import HeaderMenu from './components/HeaderMenu'
import AddFriend from './components/AddFriend'

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
  const [stage, setStage] = useState('normal')
  const [nextFriend, setNextFriend] = useState(null)

  return (
    <Grommet>
      <GlobalStyle />
      <Wrapper>
        <HeaderMenu stage={stage} setStage={setStage} nextFriend={nextFriend} />
        <DiagramBody
          stage={stage}
          setStage={setStage}
          setNextFriend={setNextFriend}
        />
        {stage === 'input' ? (
          <AddFriend
            setStage={setStage}
            nextFriend={nextFriend}
            setNextFriend={setNextFriend}
          />
        ) : null}
      </Wrapper>
    </Grommet>
  )
}

export default App
