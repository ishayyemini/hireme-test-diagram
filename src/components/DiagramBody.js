import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grid, Box } from 'grommet'
import localforage from 'localforage'
import PropTypes from 'prop-types'

import FriendBox from './FriendBox'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const DiagramBody = ({ stage, setNextFriend, setStage }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    if (stage === 'normal') {
      const nextData = {}
      localforage
        .iterate((value, key) => {
          nextData[key] = value
        })
        .then(() => {
          Object.keys(nextData).forEach(
            (key) =>
              (nextData[key].children =
                nextData[key].children?.map((coords) => nextData[coords]) ?? [])
          )
          setData(nextData)
        })
    }
  }, [stage])

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
        {gridLayout.map((item, index) => (
          <FriendBox
            friend={data[item.toString()]}
            onEmptyClick={
              stage === 'select'
                ? () => {
                    setNextFriend((friend) => ({
                      ...friend,
                      coords: item.toString(),
                    }))
                    setStage('input')
                  }
                : null
            }
            stage={stage}
            key={index}
          />
        ))}
      </Grid>
    </Wrapper>
  )
}

DiagramBody.propTypes = {
  stage: PropTypes.oneOf(['normal', 'select', 'input']).isRequired,
  setNextFriend: PropTypes.func.isRequired,
  setStage: PropTypes.func.isRequired,
}

export default DiagramBody
