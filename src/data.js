import localforage from 'localforage'

import { _childPercent, _price } from './config.json'

export const calcChildProfit = (friend) => {
  let profit = 0
  if (friend.children?.length) {
    friend.children.forEach((child) => {
      profit += (calcChildProfit(child) + child.sales * _price) * _childPercent
    })
  }
  return Math.round(profit)
}

const getCoords = (coords) => {
  let x, y
  if (Array.isArray(coords)) {
    ;[x, y] = coords.map((i) => parseInt(i))
  } else if (typeof coords === 'string') {
    ;[x, y] = coords.split(',').map((i) => parseInt(i))
  } else {
    ;({ x, y } = coords)
  }
  return [x, y]
}

const storage = {
  getAll: async () => {
    const nextData = {}
    await localforage
      .iterate((value, key) => {
        nextData[key] = value
      })
      .then(() => {
        Object.keys(nextData).forEach((key) => {
          nextData[key].children =
            nextData[key].children?.map((coords) => nextData[coords]) ?? []
        })
      })
    return nextData
  },

  update: (coords, item) =>
    localforage
      .getItem(getCoords(coords).toString())
      .then((oldItem) =>
        localforage.setItem(
          getCoords(coords).toString(),
          typeof item === 'function' ? item(oldItem) : { ...oldItem, ...item }
        )
      ),

  move: (oldCoords, newCoords) =>
    localforage
      .getItem(getCoords(oldCoords).toString())
      .then((oldItem) =>
        localforage.setItem(getCoords(newCoords).toString(), {
          ...oldItem,
          x: getCoords(newCoords)[0],
          y: getCoords(newCoords)[1],
        })
      )
      .then(() => localforage.removeItem(getCoords(oldCoords).toString())),

  add: (coords, item) =>
    localforage.setItem(getCoords(coords).toString(), {
      ...item,
      x: getCoords(coords)[0],
      y: getCoords(coords)[1],
    }),

  delete: (coords) =>
    localforage
      .removeItem(getCoords(coords).toString())
      .then(() =>
        localforage.iterate((value, key) =>
          value.children?.includes(getCoords(coords).toString())
            ? { key, value }
            : undefined
        )
      )
      .then(({ key, value }) =>
        localforage.setItem(key, {
          ...value,
          children: value.children.filter(
            (child) => child !== getCoords(coords).toString()
          ),
        })
      ),

  replaceAll: (items) =>
    localforage
      .clear()
      .then(() =>
        Promise.all(
          Object.entries(items || {}).map(([key, value]) =>
            localforage.setItem(key, value)
          )
        )
      ),
}

export default storage
