import { Map, List } from 'immutable';
import * as types from '../constants';
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
  checkAndApplyFiltersForGoal(filters, g, limit) {
    return filters.map((f) => {
      if(limit && !limit.get(f.get('id'))){
        return f;
      }
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
  storeChange() {
    const state = this.store.getState();
    this.myId = state.getIn(['me', 'id']);

    const orgFilters = state.get('filters');
    let filters = orgFilters;

    const orgGoalFilters = filters.get('goals');
    let goalFilters = orgGoalFilters;

    let diffFilters;
    if(this.prevFilters && filters !== this.prevFilters){

      diffFilters = filters.get('goals').filter(
        (f, k) => f.get('filter') !== this.prevFilters.getIn(['goals', k, 'filter'])
      ).map(f => f.get('id'));
    }

    const goals = state.get('goals');
    if (goals !== this.previousGoals || (diffFilters && diffFilters.size)) {
      this.previousGoals = this.previousGoals || Map();
      goals.forEach((g, k) => {
        const prev = this.previousGoals.get(k);
        if (prev !== g) {
          // console.log('goal changed', g.get('title'));
          goalFilters = this.checkAndApplyFiltersForGoal(goalFilters, g);
        } else if(diffFilters && diffFilters.size){
          goalFilters = this.checkAndApplyFiltersForGoal(goalFilters, g, diffFilters);
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
      this.prevNotifications = this.prevNotifications || List();
      let notifFilters = filters.get('notifications')
        .map(f => f.set('unread', 0).set('notifications', List()));
      let counter = 0;
      notifications.forEach((n, i) => {
        notifFilters.forEach((f, k) => {
          if (f.get('filter')(n)) {
            notifFilters = notifFilters.updateIn([k, 'notifications'], notifs => notifs.push(i));
            if (!n.get('seen_at') && (k === 'received')) {
              const curr = notifFilters.getIn([k, 'unread']);
              notifFilters = notifFilters.setIn([k, 'unread'], curr + 1);
              counter += 1;
            }
          }
        });
      });
      filters = filters.set('notifications', notifFilters);
      const currUnread = state.getIn(['navigation', 'counters', 'Notifications']);

      this.prevNotifications = notifications;
      if (currUnread !== counter) {
        this.store.dispatch({ type: types.UPDATE_NOTIFICATION_COUNTER, payload: { counter } });
        if (window.ipcListener) {
          window.ipcListener.setBadgeCount(`${counter || ''}`);
        }
      }
    }

    if (filters !== orgFilters) {
      this.prevFilters = filters;
      this.store.dispatch({ type: types.UPDATE_FILTERS, payload: { filters } });
    }
  }
}
