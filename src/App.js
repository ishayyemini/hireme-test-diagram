import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Grommet, Box } from 'grommet'

import DiagramBody from './components/DiagramBody'
import TableBody from './components/TableBody'
import HeaderMenu from './components/HeaderMenu'
import AddFriend from './components/AddFriend'
import InputExportBody from './components/InputExportBody'

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

  useEffect(() => {
    if (stage === 'normal') setNextFriend(null)
  }, [stage])

  return (
    <Grommet>
      <GlobalStyle />
      <Wrapper>
        <HeaderMenu stage={stage} setStage={setStage} nextFriend={nextFriend} />

        {stage.includes('table') ? <TableBody stage={stage} /> : null}

        {stage === 'rawInput' ? <InputExportBody stage={stage} /> : null}

        {!stage.includes('table') && stage !== 'rawInput' ? (
          <DiagramBody
            stage={stage}
            setStage={setStage}
            setNextFriend={setNextFriend}
          />
        ) : null}

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
