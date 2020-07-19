import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, DataTable, Meter, TextInput } from 'grommet'
import localforage from 'localforage'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'

const Wrapper = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;
`

const _price = 100
const _childPercent = 0.2

const childProfit = (friend) => {
  let profit = 0
  if (friend.children?.length) {
    friend.children.forEach((child) => {
      profit += (childProfit(child) + child.sales * _price) * _childPercent
    })
  }
  return Math.round(profit)
}

const TableBody = ({ stage }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    if (stage === 'table') {
      const nextData = {}
      localforage
        .iterate((value, key) => {
          nextData[key] = value
        })
        .then(() => {
          Object.keys(nextData).forEach((key) => {
            nextData[key].children =
              nextData[key].children?.map((coords) => nextData[coords]) ?? []
          })
          setData(nextData)
        })
    }
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

  const saveField = useCallback(({ target: { name, value } }) => {
    const [key, field] = name.split('.')
    value = field === 'sales' ? Number(value) : value
    localforage
      .getItem(key)
      .then((friend) => localforage.setItem(key, { ...friend, [field]: value }))
  }, [])

  const tableData = Object.entries(data).map(([key, value]) => ({
    ...value,
    salesProfit: value.sales * _price,
    childProfit: childProfit(value),
    totalProfit: value.sales * _price + childProfit(value),
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
