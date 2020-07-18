import React from 'react'
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

const EmptyWrapper = styled(Box).attrs({
  background: 'lightgray',
  margin: 'medium',
  responsive: false,
  round: 'full',
})`
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
  return profit
}

const FriendBox = ({ friend, stage, onEmptyClick, onFriendClick }) => {
  if (friend) {
    const profit = friend.sales * _price
    const childProfit = calcChildProfit(friend)

    const lines = friend.children?.map((child, index) => {
      return (
        <svg
          style={{ position: 'absolute', zIndex: -1, overflow: 'visible' }}
          key={index}
        >
          <line
            x2={(child.x - friend.x) * 100}
            y2={(child.y - friend.y) * 100}
            stroke={'black'}
          />
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
          >
            {friend.name}
          </FriendWrapper>
        </Stack>
        <ReactTooltip effect={'solid'} />
      </>
    )
  } else return <EmptyWrapper onClick={onEmptyClick} stage={stage} />
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
}

export default FriendBox
