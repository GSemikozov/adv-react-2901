import { List, OrderedSet, Record } from 'immutable'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { createSelector } from 'reselect'

import { appName } from '../config'
import api from '../services/api'
import { fbToEntities } from '../services/util'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`

export const FETCH_LAZY_REQUEST = `${prefix}/FETCH_LAZY_REQUEST`
export const FETCH_LAZY_START = `${prefix}/FETCH_LAZY_START`
export const FETCH_LAZY_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`

export const TOGGLE_SELECTION = `${prefix}/TOGGLE_SELECTION`

/**
 * Reducer
 * */
export const ReducerRecord = Record({
  loading: false,
  loaded: false,
  selected: new OrderedSet([]),
  entities: new List([])
})

export const EventRecord = Record({
  id: null,
  month: null,
  submissionDeadline: null,
  title: null,
  url: null,
  when: null,
  where: null
})

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action

  switch (type) {
    case FETCH_ALL_START:
      return state.set('loading', true)

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbToEntities(payload, EventRecord))

    case TOGGLE_SELECTION:
      return state.update('selected', (selected) =>
        selected.has(payload.id)
          ? selected.remove(payload.id)
          : selected.add(payload.id)
      )

    case FETCH_LAZY_SUCCESS:
      return state
        .set('loading', false)
        .megreIn(['entities'], fbToEntities(payload, EventRecord))
        .set('loaded', Object.keys(payload).length < 10)

    default:
      return state
  }
}

/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName]
export const entitiesSelector = createSelector(
  stateSelector,
  (state) => state.entities
)
export const loadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
export const loadedSelector = createSelector(
  stateSelector,
  (state) => state.loaded
)
export const eventListSelector = createSelector(
  entitiesSelector,
  (entities) => entities.toArray()
)

export const selectionSelector = createSelector(
  stateSelector,
  (state) => state.selected.toArray()
)

export const selectedEventsSelector = createSelector(
  selectionSelector,
  entitiesSelector,
  (selection, entities) =>
    selection.map((id) => entities.find((event) => event.id === id))
)

/**
 * Action Creators
 * */

export function fetchAllEvents() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

export function toggleSelection(id) {
  return {
    type: TOGGLE_SELECTION,
    payload: { id }
  }
}

export function fetchLazy() {
  return {
    type: FETCH_LAZY_REQUEST
  }
}

/**
 * Sagas
 * */
export function* fetchLazySaga() {
  const state = select(stateSelector)

  if (state.loading || state.loaded) return

  yield put({
    type: FETCH_LAZY_START
  })

  const lastEvent = state.entities.last()
  const data = yield call(api.fetchLazyEvents, lastEvent && lastEvent.title)

  yield put({
    type: FETCH_LAZY_SUCCESS,
    payload: data
  })
}

export function* fetchAllSaga() {
  yield put({
    type: FETCH_ALL_START
  })

  const data = yield call(api.fetchAllEvents)

  yield put({
    type: FETCH_ALL_SUCCESS,
    payload: data
  })
}

export function* saga() {
  yield all([
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    takeEvery(FETCH_LAZY_REQUEST, fetchLazySaga)
  ])
}
