// Main
export const SET_STATUS = 'SET_STATUS';
export const SET_UPDATE_STATUS = 'SET_UPDATE_STATUS';
export const SET_MAXIMIZED = 'SET_MAXIMIZED';
export const SET_FULLSCREEN = 'SET_FULLSCREEN';
export const LOGOUT = 'LOGOUT';
export const CACHE_SAVE = 'CACHE_SAVE';
export const CACHE_REMOVE = 'CACHE_REMOVE';
export const CACHE_CLEAR = 'CACHE_CLEAR';
export const TOOLTIP = 'TOOLTIP';
export const UPDATE_RECENT_ASSIGNEES = 'UPDATE_RECENT_ASSIGNEES';
export const CONTEXT_MENU = 'CONTEXT_MENU';
export const SLACK_OPEN_IN = 'SLACK_OPEN_IN';

// Notification
export const NOTIFICATION_ADD = 'NOTIFICATION_ADD';

// Notes
export const NOTE_CACHE = 'NOTE_CACHE';
export const NOTE_SAVE = 'NOTE_SAVE';
export const NOTE_SAVE_START = 'NOTE_SAVE_START';
export const NOTE_SAVE_SUCCESS = 'NOTE_SAVE_SUCCESS';
export const NOTE_SAVE_ERROR = 'NOTE_SAVE_ERROR';

// Navigation
export const NAVIGATION_SET = 'NAVIGATION_SET';
export const NAVIGATION_PUSH = 'NAVIGATION_PUSH';
export const NAVIGATION_POP = 'NAVIGATION_POP';
export const NAVIGATION_SAVE_STATE = 'NAVIGATION_SAVE_STATE';
export const NAVIGATION_SET_COUNTER = 'NAVIGATION_SET_COUNTER';

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

// Used internally for the API
// listen in reducers directly to rest calls like: 'rtm.start'
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';
