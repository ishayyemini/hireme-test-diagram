import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Stack } from 'grommet'
import ReactTooltip from 'react-tooltip'

const FriendWrapper = styled(Box).attrs({
  background: 'lightblue',
  pad: 'xsmall',
  responsive: false,
})`
  border-radius: 4px;
  user-select: none;
`

const EmptyWrapper = styled(Box).attrs((props) => ({
  background: props.isHovering ? 'black' : 'lightgray',
  margin: props.isHovering ? 'small' : 'medium',
  responsive: false,
  round: 'full',
}))`
  opacity: 0.5;
  border: ${(props) => (props.stage === 'select' ? '1px dashed black' : null)};

  :hover {
    border-style: ${(props) => (props.stage === 'select' ? 'solid' : null)};
  }
`

const _price = 100
const _childPercent = 0.2

const calcChildProfit = (friend) => {
  let profit = 0
  if (friend.children?.length) {
    friend.children.forEach((child) => {
      profit += (calcChildProfit(child) + child.sales * _price) * _childPercent
    })
  }
  return Math.round(profit)
}

const FriendBox = ({
  friend,
  stage,
  onEmptyClick,
  onFriendClick,
  onDrop,
  id,
}) => {
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    setIsHovering(false)
  }, [friend])

  if (friend) {
    const profit = friend.sales * _price
    const childProfit = calcChildProfit(friend)

    const lines = friend.children?.map((child, index) => {
      const xDiff = child.x - friend.x
      const yDiff = child.y - friend.y
      const points = Array.from(
        Array(Math.max(Math.round((xDiff ** 2 + yDiff ** 2) ** 0.5), 3)),
        () => null
      )
        .map((_, i, arr) => [
          (xDiff / (arr.length - 1)) * i * 100,
          (yDiff / (arr.length - 1)) * i * 100,
        ])
        .join(' ')

      return (
        <svg
          style={{ position: 'absolute', zIndex: -1, overflow: 'visible' }}
          key={index}
        >
          <defs>
            <marker
              id={'t'}
              markerWidth={'8'}
              markerHeight={'8'}
              orient={'auto'}
              refY={'4'}
            >
              <path d={'M0,0 L8,4 0,8'} />
            </marker>
          </defs>

          <polyline markerMid={'url(#t)'} points={points} stroke={'black'} />
        </svg>
      )
    })

    return (
      <>
        <Stack anchor={'center'} margin={'auto'}>
          {lines}
          <FriendWrapper
            onClick={onFriendClick}
            data-tip={`
              Name: ${friend.name}<br />
              Sales: ${friend.sales}<br />
              Sales profit: ${profit}<br />
              Children's sales profit: ${childProfit}<br />
              Total profit: ${profit + childProfit}
            `}
            data-html={true}
            data-for={`tooltip-${id}`}
            data-tip-disable={stage === 'select'}
            id={id}
            onDragStart={(e) => e.dataTransfer.setData('text', e.target.id)}
            draggable={stage !== 'select'}
          >
            {friend.name}
          </FriendWrapper>
        </Stack>
        <ReactTooltip effect={'solid'} id={`tooltip-${id}`} />
      </>
    )
  } else
    return (
      <EmptyWrapper
        onClick={onEmptyClick}
        stage={stage}
        isHovering={isHovering}
        onDragOver={(e) => {
          setIsHovering(true)
          e.preventDefault()
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={onDrop}
        id={id}
      />
    )
}

const friendType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  sales: PropTypes.number.isRequired,
})
friendType.children = PropTypes.arrayOf(friendType.isRequired)

FriendBox.propTypes = {
  friend: friendType,
  stage: PropTypes.oneOf(['normal', 'select', 'input']).isRequired,
  onEmptyClick: PropTypes.func,
  onFriendClick: PropTypes.func,
  onDrop: PropTypes.func,
  id: PropTypes.string.isRequired,
}

export default FriendBox
