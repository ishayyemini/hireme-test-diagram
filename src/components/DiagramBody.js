import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grid, Box } from 'grommet'
import PropTypes from 'prop-types'

import FriendBox from './FriendBox'
import storage from '../data'
import { _maxX, _maxY } from '../config'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const DiagramBody = ({ stage, setNextFriend, setStage }) => {
  const [data, setData] = useState({})
  const [update, force] = useState(null)

  useEffect(() => {
    if (stage === 'normal' || stage === 'select') storage.getAll().then(setData)
  }, [stage, update])

  console.log(data)

  const gridLayout = Array.from(Array(_maxY), (_, y) =>
    Array.from(Array(_maxX), (_, x) => [x, y])
  ).flat()

  return (
    <Wrapper
      onScroll={(e) => console.log(e.target.scrollTop, e.target.scrollLeft)}
    >
      <Grid
        rows={Array.from(Array(_maxY), () => '100px')}
        columns={Array.from(Array(_maxX), () => '100px')}
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
            onFriendClick={() => {
              if (stage === 'normal') {
                setNextFriend((friend) => ({
                  ...friend,
                  parentCoords: item.toString(),
                }))
                setStage('select')
              }
            }}
            onDrop={async (e) => {
              const [fromX, fromY] = e.dataTransfer
                .getData('text')
                .split(',')
                .map((i) => parseInt(i))
              const [toX, toY] = e.target.id.split(',').map((i) => parseInt(i))
              console.log('dragging from:', fromX, fromY, 'into:', toX, toY)

              if ((fromX !== toX || fromY !== toY) && !data[[toX, toY]]) {
                await storage.move([fromX, fromY], [toX, toY])

                const hasParent = Object.values(data).find((item) =>
                  item.children.find(
                    (child) => child.x === fromX && child.y === fromY
                  )
                )
                if (hasParent)
                  await storage.update(
                    hasParent,
                    ({ children, ...oldItem }) => ({
                      ...oldItem,
                      children: [
                        ...children.filter(
                          (key) => key !== [fromX, fromY].toString()
                        ),
                        [toX, toY].toString(),
                      ],
                    })
                  )

                force((s) => !s)
              }
            }}
            update={() => force((s) => !s)}
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
  stage: PropTypes.oneOf(['normal', 'select', 'input', 'table']).isRequired,
  setNextFriend: PropTypes.func.isRequired,
  setStage: PropTypes.func.isRequired,
}

export default DiagramBody
