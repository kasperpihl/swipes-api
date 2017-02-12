// Main
export const SET_STATUS = 'SET_STATUS';
export const LOGOUT = 'LOGOUT';
export const CACHE_SAVE = 'CACHE_SAVE';
export const CACHE_REMOVE = 'CACHE_REMOVE';
export const CACHE_CLEAR = 'CACHE_CLEAR';
export const OVERLAY = 'OVERLAY';
export const MODAL = 'MODAL';
export const NOTE_SHOW = 'NOTE_SHOW';
export const NOTE_HIDE = 'NOTE_HIDE';
export const UPDATE_RECENT_ASSIGNEES = 'UPDATE_RECENT_ASSIGNEES';
export const CONTEXT_MENU = 'CONTEXT_MENU';
export const SLACK_OPEN_IN = 'SLACK_OPEN_IN';
export const SET_SLACK_URL = 'SET_SLACK_URL';

// Notification
export const NOTIFICATION_ADD = 'NOTIFICATION_ADD';

// Navigation
export const NAVIGATION_SET = 'NAVIGATION_SET';
export const NAVIGATION_PUSH = 'NAVIGATION_PUSH';
export const NAVIGATION_WILL_CHANGE_TO = 'NAVIGATION_WILL_CHANGE_TO';
export const NAVIGATION_POP = 'NAVIGATION_POP';
export const NAVIGATION_POP_TO = 'NAVIGATION_POP_TO';
export const NAVIGATION_POP_TO_ROOT = 'NAVIGATION_POP_TO_ROOT';
export const NAVIGATION_SET_COUNTER = 'NAVIGATION_SET_COUNTER';

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

// Preview
export const PREVIEW_LOADING = 'PREVIEW_LOADING';
export const PREVIEW = 'PREVIEW';

// Modal
export const LOAD_MODAL = 'LOAD_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';


// Used internally for the API
// listen in reducers directly to rest calls like: 'rtm.start'
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';
