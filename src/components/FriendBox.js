import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Button, Stack } from 'grommet'
import ReactTooltip from 'react-tooltip'

import EditFriend from './EditFriend'
import { calcChildProfit } from '../data'
import { _price } from '../config'

const FriendWrapper = styled(Box).attrs({
  background: 'lightblue',
  pad: 'xsmall',
  responsive: false,
})`
  border-radius: 4px;
  user-select: none;
  overflow-wrap: break-word;
  text-align: center;
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

const EditButton = styled(Button).attrs({ title: 'edit' })`
  background: white url(${'/create-24px.svg'}) no-repeat center;
  height: 36px;
  width: 24px;
  float: right;
`

const FriendBox = ({
  friend,
  stage,
  onEmptyClick,
  onFriendClick,
  onDrop,
  id,
  update,
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

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
        <Stack anchor={'center'} margin={'auto'} style={{ maxWidth: '100%' }}>
          {lines}
          <FriendWrapper
            onClick={onFriendClick}
            onDragEnd={() => setIsDragging(false)}
            onDragStart={(e) => {
              setIsDragging(true)
              e.dataTransfer.setData('text', e.target.id)
            }}
            draggable={stage !== 'select'}
            data-for={`tooltip-${id}`}
            data-tip
            id={id}
          >
            {friend.name}
          </FriendWrapper>
        </Stack>

        {!isDragging && stage !== 'select' && !isEdit ? (
          <ReactTooltip
            id={`tooltip-${id}`}
            effect={'solid'}
            delayHide={200}
            clickable
          >
            <EditButton onClick={() => setIsEdit(true)} />
            <div>
              <div>Name: {friend.name}</div>
              <div>Sales: {friend.sales}</div>
              <div>Sales profit: ${profit}</div>
              <div>Children's sales profit: ${childProfit}</div>
              <div>Total profit: ${profit + childProfit}</div>
            </div>
          </ReactTooltip>
        ) : null}

        {isEdit ? (
          <EditFriend
            friendValues={friend}
            submit={() => {
              setIsEdit(false)
              update()
            }}
          />
        ) : null}
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
  update: PropTypes.func.isRequired,
}

export default FriendBox
