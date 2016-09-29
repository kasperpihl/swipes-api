// Main
export const TOGGLE_FULLSCREEN = 'TOGGLE_FULLSCREEN'
export const SET_FULLSCREEN_TITLE = 'SET_FULLSCREEN_TITLE'

export const TOGGLE_FIND = 'TOGGLE_FIND'
export const SET_STATUS = 'SET_STATUS'
export const LOGOUT = 'LOGOUT'
export const SEARCH = 'SEARCH'
export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'
export const SET_DRAGGING_DOT = 'SET_DRAGGING_DOT'
export const DRAG_DOT = 'DRAG_DOT'


// Overlay
export const SET_OVERLAY = 'SET_OVERLAY'
export const PUSH_OVERLAY = 'PUSH_OVERLAY'
export const CLEAR_OVERLAY = 'CLEAR_OVERLAY'

// Modal
export const LOAD_MODAL = 'LOAD_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'


// Used internally for the API
// listen in reducers directly to rest calls like: 'rtm.start'
export const API_REQUEST = 'API_REQUEST'
export const API_SUCCESS = 'API_SUCCESS'
export const API_ERROR = 'API_ERROR'


// Workspace
export const UPDATE_COLUMNS = 'UPDATE_COLUMNS'
export const TILE_SAVE_DATA = 'TILE_SAVE_DATA'
export const REMOVE_TILE = 'REMOVE_TILE'