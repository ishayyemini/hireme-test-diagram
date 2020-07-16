import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grid, Box } from 'grommet'
import localforage from 'localforage'
import FriendBox from './FriendBox'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const DiagramBody = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    const nextData = {}
    localforage
      .iterate((value, key) => {
        nextData[key] = value
      })
      .then(() => setData(nextData))
  }, [])

  console.log(data)

  const [maxX, maxY] = [10, 10]
  const gridLayout = Array.from(Array(maxX), (_, x) =>
    Array.from(Array(maxY), (_, y) => [x, y])
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
        {gridLayout.map((item, index) =>
          data[item.toString()] ? (
            <FriendBox friend={data[item.toString()]} key={index} />
          ) : (
            <Box
              background={'lightgray'}
              style={{ borderRadius: '50%' }}
              margin={'medium'}
              key={index}
            />
          )
        )}
      </Grid>
    </Wrapper>
  )
}

export default DiagramBody
