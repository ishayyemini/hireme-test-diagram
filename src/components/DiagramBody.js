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
  const [update, force] = useState(null)

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
  }, [stage, update])

  console.log(data)

  const [maxX, maxY] = [10, 10]
  const gridLayout = Array.from(Array(maxY), (_, y) =>
    Array.from(Array(maxX), (_, x) => [x, y])
  ).flat()

  return (
    <Wrapper
      onScroll={(e) => console.log(e.target.scrollTop, e.target.scrollLeft)}
    >
      <Grid
        rows={Array.from(Array(maxY), () => '100px')}
        columns={Array.from(Array(maxX), () => '100px')}
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
            onFriendClick={
              stage === 'normal'
                ? () => {
                    setNextFriend((friend) => ({
                      ...friend,
                      parentCoords: item.toString(),
                    }))
                    setStage('select')
                  }
                : null
            }
            onDrop={async (e) => {
              const [fromX, fromY] = e.dataTransfer
                .getData('text')
                .split(',')
                .map((i) => parseInt(i))
              const [toX, toY] = e.target.id.split(',').map((i) => parseInt(i))
              console.log('dragging from:', fromX, fromY, 'into:', toX, toY)

              if ((fromX !== toX || fromY !== toY) && !data[[toX, toY]]) {
                await localforage
                  .getItem([fromX, fromY].toString())
                  .then((friend) =>
                    localforage.setItem([toX, toY].toString(), {
                      ...friend,
                      x: toX,
                      y: toY,
                    })
                  )
                  .then(() => localforage.removeItem([fromX, fromY].toString()))

                const hasParent = Object.values(data).find((item) =>
                  item.children.find(
                    (child) => child.x === fromX && child.y === fromY
                  )
                )
                if (hasParent) {
                  await localforage
                    .getItem([hasParent.x, hasParent.y].toString())
                    .then((parent) =>
                      localforage.setItem(
                        [hasParent.x, hasParent.y].toString(),
                        {
                          ...parent,
                          children: [
                            ...parent.children.filter(
                              (key) => key !== [fromX, fromY].toString()
                            ),
                            [toX, toY].toString(),
                          ],
                        }
                      )
                    )
                }

                force((s) => !s)
              }
            }}
            id={item.toString()}
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
