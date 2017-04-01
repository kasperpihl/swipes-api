import { Map, List } from 'immutable';
import * as types from '../constants/ActionTypes';
import { bindAll } from './utils';
import filterGoal from './filter-goals';

export default class FilterHandler {
  constructor(store) {
    this.store = store;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
  removeGoalFromFilters(filters, g) {
    return filters.map(f => f.updateIn(['goals'], goals => goals && goals.delete(g.get('id'))));
  }
  checkAndApplyFiltersForGoal(filters, g) {
    return filters.map((f) => {
      let filter = f.get('filter');
      if (filter.get('userId') && filter.get('userId') === 'me') {
        filter = filter.set('userId', this.myId);
      }
      const isInFilter = filterGoal(g, filter);
      if (isInFilter) {
        f = f.updateIn(['goals'], goals => goals.add(g.get('id')));
      } else if (f.get('goals')) {
        f = f.updateIn(['goals'], goals => goals.delete(g.get('id')));
      }
      return f;
    });
  }
  checkAndApplyFiltersForNotification(filters, n) {

  }
  storeChange() {
    const state = this.store.getState();
    this.myId = state.getIn(['me', 'id']);

    const orgFilters = state.get('filters');
    let filters = orgFilters;

    const goals = state.get('goals');
    if (goals !== this.previousGoals) {
      const orgGoalFilters = filters.get('goals');
      let goalFilters = orgGoalFilters;
      this.previousGoals = this.previousGoals || Map();
      goals.forEach((g, k) => {
        const prev = this.previousGoals.get(k);
        if (prev !== g) {
          // console.log('goal changed', g.get('title'));
          goalFilters = this.checkAndApplyFiltersForGoal(goalFilters, g);
        }
      });
      this.previousGoals.forEach((g, k) => {
        if (!goals.get(k)) {
          // console.log('goal removed', g.get('title'));
          goalFilters = this.removeGoalFromFilters(goalFilters, g);
        }
      });
      if (goalFilters !== orgGoalFilters) {
        this.previousGoals = goals;
        filters = filters.set('goals', goalFilters);
      }
    }

    const notifications = state.get('notifications');
    if (notifications !== this.prevNotifications) {
      const orgNotifFilters = filters.get('notifications');
      const notifFilters = orgNotifFilters;

      this.prevNotifications = this.prevNotifications || List();
      notifications.forEach((n, i) => {

      });
      if (notifFilters !== orgNotifFilters) {
        this.prevNotifications = notifications;
        filters = filters.set('notifications', notifFilters);
      }
    }

    if (filters !== orgFilters) {
      this.store.dispatch({ type: types.UPDATE_FILTERS, payload: { filters } });
    }
  }
}
