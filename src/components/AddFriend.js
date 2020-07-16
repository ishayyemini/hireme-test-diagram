import React from 'react'
import { Box, Button, Layer, Text, TextInput } from 'grommet'
import localforage from 'localforage'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'

const AddFriend = ({ setStage, setNextFriend, nextFriend }) => {
  const formik = useFormik({
    initialValues: { name: '', sales: '' },
    onSubmit: async (values) => {
      await localforage.setItem(nextFriend.coords.toString(), values)
      setStage('normal')
      setNextFriend(null)
    },
    onReset: () => {
      setStage('normal')
      setNextFriend(null)
    },
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
  setNextFriend: PropTypes.func.isRequired,
  nextFriend: PropTypes.shape({ coords: PropTypes.string.isRequired }),
}

export default AddFriend
