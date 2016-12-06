// Main
export const SET_STATUS = 'SET_STATUS';
export const LOGOUT = 'LOGOUT';
export const SET_ACTIVE_GOAL = 'SET_ACTIVE_GOAL';
export const CACHE_SAVE = 'CACHE_SAVE';
export const CACHE_REMOVE = 'CACHE_REMOVE';
export const CACHE_CLEAR = 'CACHE_CLEAR';

// Navigation
export const NAVIGATION_SET = 'NAVIGATION_SET';
export const NAVIGATION_PUSH = 'NAVIGATION_PUSH';
export const NAVIGATION_POP = 'NAVIGATION_POP';
export const NAVIGATION_POP_TO = 'NAVIGATION_POP_TO';
export const NAVIGATION_POP_TO_ROOT = 'NAVIGATION_POP_TO_ROOT';

// Goals
export const GOAL_DELETE = 'GOAL_DELETE';

// Search
export const SEARCH = 'SEARCH';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

// Toasty
export const TOAST_ADD = 'TOAST_ADD';
export const TOAST_REMOVE = 'TOAST_REMOVE';
export const TOAST_UPDATE = 'TOAST_UPDATE';

// Overlay
export const SET_OVERLAY = 'SET_OVERLAY';
export const POP_OVERLAY = 'POP_OVERLAY';
export const PUSH_OVERLAY = 'PUSH_OVERLAY';
export const CLEAR_OVERLAY = 'CLEAR_OVERLAY';

// Modal
export const LOAD_MODAL = 'LOAD_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';


// Used internally for the API
// listen in reducers directly to rest calls like: 'rtm.start'
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';
