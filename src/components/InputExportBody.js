import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Button } from 'grommet'
import { saveAs } from 'file-saver'
import localforage from 'localforage'

const Wrapper = styled(Box).attrs({
  pad: 'medium',
  justify: 'center',
  align: 'center',
  responsive: false,
})`
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

const InputExportBody = () => {
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
        setData(nextData)
      })
  }, [])

  const saveCsv = useCallback(() => {
    const rows = [
      [
        'Name',
        'Sales',
        'Sales profit',
        "Children's sales profit",
        'Total profit',
      ],
      ...Object.values(data).map(({ name, sales, children }) => [
        name,
        sales,
        sales * _price,
        childProfit({ children }),
        sales * _price + childProfit({ children }),
      ]),
    ]

    const csvContent = rows
      .map((e) => e.map((f) => `"${f}"`).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `friends_data_${Math.round(Date.now() / 1000)}.csv`)
  }, [data])

  return (
    <Wrapper>
      <Button label={'Export CSV'} onClick={saveCsv} />
    </Wrapper>
  )
}

export default InputExportBody
