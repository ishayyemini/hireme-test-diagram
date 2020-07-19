import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, DataTable, Meter } from 'grommet'
import localforage from 'localforage'
import ReactTooltip from 'react-tooltip'

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

const TableBody = () => {
  const [data, setData] = useState({})

  useEffect(() => {
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
        Object.keys(nextData).forEach((key) => {
          nextData[key] = {
            ...nextData[key],
            key: `${nextData[key].x},${nextData[key].y}`,
            salesProfit: nextData[key].sales * _price,
            childProfit: childProfit(nextData[key], nextData),
          }
          nextData[key].key = `${nextData[key].x},${nextData[key].y}`
          nextData[key].salesProfit = nextData[key].sales * _price
          nextData[key].childProfit = childProfit(nextData[key], nextData)
          nextData[key].totalProfit =
            nextData[key].salesProfit + nextData[key].childProfit
        })
        setData(nextData)
      })
  }, [])

  console.log(data)

  return (
    <Wrapper>
      <DataTable
        columns={[
          {
            property: 'name',
            header: 'Name',
          },
          {
            property: 'sales',
            header: 'Sales',
            render: (datum) => (
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
            header: 'Total Profit',
            render: (datum) => '$' + datum.totalProfit,
          },
        ]}
        data={Object.values(data)}
        primaryKey={'key'}
        sortable
      />
    </Wrapper>
  )
}

export default TableBody
