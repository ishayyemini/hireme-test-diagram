import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, DataTable, Meter, TextInput } from 'grommet'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'

import storage, { calcChildProfit } from '../data'
import { _price } from '../config'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const TableBody = ({ stage }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    if (stage === 'table') storage.getAll().then(setData)
  }, [stage])

  console.log(data)

  const updateField = useCallback(
    ({ target: { name, value } }) => {
      const [key, field] = name.split('.')
      value = field === 'sales' ? Number(value) : value
      setData({ ...data, [key]: { ...data[key], [field]: value } })
    },
    [data]
  )

  const saveField = useCallback(async ({ target: { name, value } }) => {
    const [key, field] = name.split('.')
    value = field === 'sales' ? Number(value) : value
    await storage.update(key, { [field]: value })
  }, [])

  const tableData = Object.entries(data).map(([key, value]) => ({
    ...value,
    salesProfit: value.sales * _price,
    childProfit: calcChildProfit(value),
    totalProfit: value.sales * _price + calcChildProfit(value),
    key,
  }))

  return (
    <Wrapper>
      <DataTable
        columns={[
          {
            property: 'name',
            header: 'Name',
            render: (datum) =>
              stage === 'tableEdit' ? (
                <TextInput
                  value={data[datum.key].name}
                  name={`${datum.key}.name`}
                  onChange={updateField}
                  onBlur={saveField}
                />
              ) : (
                datum.name
              ),
          },
          {
            property: 'sales',
            header: 'Sales',
            render: (datum) =>
              stage === 'tableEdit' ? (
                <TextInput
                  value={data[datum.key].sales}
                  name={`${datum.key}.sales`}
                  onChange={updateField}
                  onBlur={saveField}
                />
              ) : (
                <>
                  <Box data-tip={datum.sales + ' sales'}>
                    <Meter
                      values={[{ value: datum.sales }]}
                      max={Math.max(
                        ...Object.values(data).map((item) => item.sales)
                      )}
                      thickness={'small'}
                      size={'small'}
                      margin={{ vertical: 'small' }}
                    />
                  </Box>
                  <ReactTooltip effect={'solid'} />
                </>
              ),
          },
          {
            property: 'salesProfit',
            header: 'Sales profit',
            render: (datum) => '$' + datum.salesProfit,
          },
          {
            property: 'childProfit',
            header: "Children's sales profit",
            render: (datum) => '$' + datum.childProfit,
          },
          {
            property: 'totalProfit',
            header: 'Total profit',
            render: (datum) => '$' + datum.totalProfit,
          },
        ]}
        data={tableData}
        primaryKey={'key'}
        sortable
      />
    </Wrapper>
  )
}

TableBody.propTypes = {
  stage: PropTypes.oneOf(['table', 'tableEdit']).isRequired,
}

export default TableBody
