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
  wrap: true,
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

      {stage !== 'tableEdit' ? (
        <Button
          label={stage === 'select' ? 'Cancel' : 'Add Friend'}
          onClick={() => setStage(stage === 'select' ? 'normal' : 'select')}
          margin={'small'}
        />
      ) : null}

      {stage !== 'select' && stage !== 'tableEdit' ? (
        <Button
          label={
            'Switch to ' +
            (stage.includes('table') ? 'Diagram' : 'Table') +
            ' View'
          }
          onClick={() => setStage(stage.includes('table') ? 'normal' : 'table')}
          margin={'small'}
        />
      ) : null}

      {stage.includes('table') ? (
        <Button
          label={stage === 'tableEdit' ? 'Done' : 'Edit Table'}
          onClick={() =>
            setStage(stage === 'tableEdit' ? 'table' : 'tableEdit')
          }
          margin={'small'}
        />
      ) : null}

      {stage !== 'select' ? (
        <Button
          label={stage === 'rawInput' ? 'Back to Diagram View' : 'Input/Export'}
          onClick={() => setStage(stage === 'rawInput' ? 'normal' : 'rawInput')}
          margin={'small'}
        />
      ) : null}
    </Wrapper>
  )
}

HeaderMenu.propTypes = {
  stage: PropTypes.oneOf([
    'normal',
    'select',
    'input',
    'table',
    'tableEdit',
    'rawInput',
  ]).isRequired,
  setStage: PropTypes.func.isRequired,
  nextFriend: PropTypes.shape({
    parentCoords: PropTypes.string,
  }),
}

export default HeaderMenu
