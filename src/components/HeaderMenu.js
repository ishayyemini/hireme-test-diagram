import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Button, Text } from 'grommet'

const Wrapper = styled(Box).attrs({
  direction: 'row',
  background: 'beige',
  align: 'center',
  pad: 'small',
  responsive: false,
})`
  flex-shrink: 0;
  width: 100vw;
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
        margin={'small'}
        onClick={() => setStage(stage === 'select' ? 'normal' : 'select')}
      />

      {stage !== 'select' ? (
        <Button
          label={
            'Switch to ' + (stage === 'table' ? 'Diagram' : 'Table') + ' View'
          }
          margin={'small'}
          onClick={() => setStage(stage === 'table' ? 'normal' : 'table')}
        />
      ) : null}
    </Wrapper>
  )
}

HeaderMenu.propTypes = {
  stage: PropTypes.oneOf(['normal', 'select', 'input', 'table']).isRequired,
  setStage: PropTypes.func.isRequired,
  nextFriend: PropTypes.shape({
    parentCoords: PropTypes.string,
  }),
}

export default HeaderMenu
