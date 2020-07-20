import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box, Button } from 'grommet'
import { saveAs } from 'file-saver'
import localforage from 'localforage'
import PropTypes from 'prop-types'

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

const [_maxX, _maxY] = [10, 10]

const InputExportBody = ({ setStage }) => {
  const inputRef = useRef()

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

  const exportCSV = useCallback(() => {
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

  const exportJSON = useCallback(() => {
    const jsonContent = JSON.stringify(Object.values(data), null, 2)
    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8',
    })
    saveAs(blob, `friends_data_${Math.round(Date.now() / 1000)}.json`)
  }, [data])

  const importJSON = useCallback(
    (e) => {
      const checkValue = (value, _, allData) =>
        value instanceof Object &&
        value.x < _maxX &&
        value.y < _maxY &&
        !isNaN(value.sales) &&
        value.name &&
        typeof value.name === 'string' &&
        Array.isArray(value.children) &&
        value.children.every(
          (child) =>
            (typeof child === 'string' &&
              allData.find(
                (maybeChild) =>
                  child === `${maybeChild?.x},${maybeChild?.y}` &&
                  checkValue(maybeChild, null, allData)
              )) ||
            checkValue(child)
        )

      if (e.target.files[0]) {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            let res = JSON.parse(reader.result || '')

            if (!Array.isArray(res)) res = Object.values(res)

            if (res.every(checkValue)) {
              const nextData = {}
              const pushData = ({ name, sales, x, y, children }) => {
                nextData[[x, y]] = {
                  name,
                  x,
                  y,
                  sales: Number(sales),
                  children: children.map((child) =>
                    typeof child === 'string' ? child : pushData(child)
                  ),
                }
                return [x, y].toString()
              }

              res.forEach(pushData)

              if (
                window.confirm(
                  `Are you sure you want to load new values? This will delete everything and insert ${
                    Object.keys(nextData).length
                  } value(s).`
                )
              )
                localforage
                  .clear()
                  .then(() =>
                    Promise.all(
                      Object.entries(nextData).map(([key, value]) =>
                        localforage.setItem(key, value)
                      )
                    ).then(() => setStage('normal'))
                  )
            } else console.log('ERROR: BAD VALUES')
          } catch (e) {
            console.log('ERROR: PARSING')
            console.log(e)
          }
        }
        reader.readAsText(e.target.files[0])
      }
    },
    [setStage]
  )

  return (
    <Wrapper>
      <Button label={'Export CSV'} onClick={exportCSV} margin={'small'} />

      <Box direction={'row'}>
        <Button label={'Export JSON'} onClick={exportJSON} margin={'small'} />

        <Button
          label={'Input JSON'}
          onClick={() => inputRef.current?.click()}
          margin={'small'}
        />
        <input
          type={'file'}
          ref={inputRef}
          accept={'application/json'}
          onChange={importJSON}
          style={{ display: 'none' }}
        />
      </Box>
    </Wrapper>
  )
}

InputExportBody.propTypes = {
  setStage: PropTypes.func.isRequired,
}

export default InputExportBody
