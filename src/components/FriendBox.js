import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from 'grommet'

const Wrapper = styled(Box)`
  max-width: 100vw;
  max-height: 100vh;
`

const FriendBox = ({ friend }) => {
  return <Wrapper>{friend.name}</Wrapper>
}

const friendType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  totalSales: PropTypes.number.isRequired,
})
friendType.children = PropTypes.arrayOf(PropTypes.shape(friendType))

FriendBox.propTypes = {
  friend: friendType,
}

export default FriendBox
