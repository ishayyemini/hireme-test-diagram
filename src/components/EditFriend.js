import React from 'react'
import { Box, Button, Layer, Text, TextInput } from 'grommet'
import localforage from 'localforage'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'

const EditFriend = ({ friendValues: { x, y, name, sales }, submit }) => {
  const formik = useFormik({
    initialValues: { name, sales },
    onSubmit: async (values) => {
      await localforage.getItem([x, y].toString()).then((friend) =>
        localforage.setItem([x, y].toString(), {
          ...friend,
          ...values,
        })
      )
      submit()
    },
    onReset: submit,
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
            Edit Friend
          </Text>

          <Box margin={'xsmall'}>
            <TextInput
              placeholder={'Name'}
              name={'name'}
              value={formik.values.name}
              autoFocus
            />
          </Box>

          <Box margin={'xsmall'}>
            <TextInput
              placeholder={'Sales'}
              name={'sales'}
              value={formik.values.sales}
              type={'number'}
            />
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

EditFriend.propTypes = {
  submit: PropTypes.func.isRequired,
  friendValues: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    sales: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
}

export default EditFriend
