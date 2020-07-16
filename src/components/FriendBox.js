import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grommet'

const FriendWrapper = styled(Box).attrs({
  background: 'lightblue',
  pad: 'xxsmall',
  margin: 'auto',
})`
  border-radius: 4px;
  user-select: none;
`

const EmptyWrapper = styled(Box).attrs({
  background: 'lightgray',
  margin: 'medium',
})`
  border-radius: 50%;
  border: ${(props) => (props.stage === 'select' ? '1px dashed black' : null)};

  :hover {
    border-style: ${(props) => (props.stage === 'select' ? 'solid' : null)};
  }
`

const FriendBox = ({ friend, stage, onEmptyClick }) => {
  return friend ? (
    <FriendWrapper>{friend.name}</FriendWrapper>
  ) : (
    <EmptyWrapper onClick={onEmptyClick} stage={stage} />
  )
}

const friendType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  totalSales: PropTypes.number.isRequired,
})
friendType.children = PropTypes.arrayOf(friendType.isRequired)

FriendBox.propTypes = {
  friend: friendType,
  stage: PropTypes.oneOf(['normal', 'select', 'input']).isRequired,
  onEmptyClick: PropTypes.func,
}

export default FriendBox
