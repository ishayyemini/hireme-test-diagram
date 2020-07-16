import React from 'react'
import { Box, Button, Layer, Text, TextInput } from 'grommet'
import localforage from 'localforage'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'

const AddFriend = ({ setStage, nextFriend }) => {
  const formik = useFormik({
    initialValues: { name: '', sales: '' },
    onSubmit: async (values) => {
      if (nextFriend.parentCoords) {
        const parent = await localforage.getItem(nextFriend.parentCoords)
        await localforage.setItem(nextFriend.parentCoords, {
          ...parent,
          children: [...(parent.children || []), nextFriend.coords],
        })
      }
      await localforage.setItem(nextFriend.coords, values)
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
