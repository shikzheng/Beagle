/* Populated by react-webpack-redux:action */
export const ADD_FILTER = 'ADD_FILTER'
export const ADD_DATA = 'ADD_DATA'
export const CHANGE_FILTER = 'CHANGE_FILTER'

export function addFilter() {
  return {type: ADD_FILTER }
}

export function addData(data) {
  return {type: ADD_DATA }
}

export function changeFilter(idx, value) {
  return {type: CHANGE_FILTER, idx, value}
}
