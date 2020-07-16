import React from 'react'
import styled from 'styled-components'
import { Grid, Box } from 'grommet'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const DiagramBody = () => {
  const [maxX, maxY] = [50, 50]
  const gridLayout = Array.from(Array(maxX), (x) =>
    Array.from(Array(maxY), (y) => [x, y])
  ).flat()

  return (
    <Wrapper
      onScroll={(e) => console.log(e.target.scrollTop, e.target.scrollLeft)}
    >
      <Grid
        rows={Array.from(Array(maxY), () => 'xsmall')}
        columns={Array.from(Array(maxX), () => 'xsmall')}
        gap={'small'}
      >
        {gridLayout.map((item, index) => (
          <Box
            background={'lightgray'}
            style={{ borderRadius: '50%' }}
            margin={'medium'}
            key={index}
          />
        ))}
      </Grid>
    </Wrapper>
  )
}

export default DiagramBody
