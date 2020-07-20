import React from 'react'
import { Box, Button, Layer, Text, TextInput } from 'grommet'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'

import storage from '../data'

const AddFriend = ({ setStage, nextFriend: { coords, parentCoords } }) => {
  const formik = useFormik({
    initialValues: { name: '', sales: '' },
    onSubmit: async (values) => {
      if (parentCoords) {
        await storage.update(parentCoords, ({ children, ...oldValues }) => ({
          ...oldValues,
          children: [...(children || []), coords],
        }))
      }
      await storage.add(coords, values)
      setStage('normal')
    },
    onReset: () => setStage('normal'),
  })

  return (
    <Layer onEsc={formik.handleReset} onClickOutside={formik.handleReset}>
      <form
        onChange={formik.handleChange}
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        <Box justify={'center'}>
          <Text textAlign={'center'} margin={'small'}>
            Please input friend's values:
          </Text>

          <Box margin={'xsmall'}>
            <TextInput placeholder={'Name'} name={'name'} autoFocus />
          </Box>

          <Box margin={'xsmall'}>
            <TextInput placeholder={'Sales'} name={'sales'} type={'number'} />
          </Box>

          <Box direction={'row'} justify={'center'}>
            <Button label={'Cancel'} type={'reset'} margin={'small'} />
            <Button label={'Submit'} type={'submit'} margin={'small'} />
          </Box>
        </Box>
      </form>
    </Layer>
  )
}

AddFriend.propTypes = {
  setStage: PropTypes.func.isRequired,
  nextFriend: PropTypes.shape({
    coords: PropTypes.string.isRequired,
    parentCoords: PropTypes.string,
  }),
}

export default AddFriend
