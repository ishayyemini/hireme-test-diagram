import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grommet'
import ReactTooltip from 'react-tooltip'

const FriendWrapper = styled(Box).attrs({
  background: 'lightblue',
  pad: 'xsmall',
  margin: 'auto',
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

    return (
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
        <ReactTooltip effect={'solid'} />
      </FriendWrapper>
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
