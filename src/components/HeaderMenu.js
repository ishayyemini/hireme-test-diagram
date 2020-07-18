import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Button, Text } from 'grommet'

const Wrapper = styled(Box).attrs({
  direction: 'row',
  background: 'beige',
  align: 'center',
})`
  width: 100vw;
  height: 100px;
`

const HeaderMenu = ({ stage, setStage, nextFriend }) => {
  return (
    <Wrapper>
      {stage === 'select' ? (
        <Text margin={'small'}>
          Please select coordinates for
          {nextFriend?.parentCoords ? ' child' : ' friend'}
        </Text>
      ) : null}
      <Button
        label={stage === 'select' ? 'Cancel' : 'Add Friend'}
        size={'small'}
        margin={'small'}
        onClick={() => setStage(stage === 'select' ? 'normal' : 'select')}
      />
    </Wrapper>
  )
}

HeaderMenu.propTypes = {
  stage: PropTypes.oneOf(['normal', 'select', 'input']).isRequired,
  setStage: PropTypes.func.isRequired,
  nextFriend: PropTypes.shape({
    parentCoords: PropTypes.string,
  }),
}

export default HeaderMenu
