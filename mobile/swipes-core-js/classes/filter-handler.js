import * as types from '../constants/ActionTypes';
import { Map, OrderedSet } from 'immutable';
import { bindAll } from './utils';
import filterGoal from './filter-goals';

export default class FilterHandler {
  constructor(store) {
    this.store = store;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
  removeGoalFromFilters(filters, g) {
    return filters.map((f) => f.updateIn(['goals'], (goals) => goals && goals.delete(g.get('id'))));
  }
  checkAndApplyFiltersForGoal(filters, g){
    return filters.map((f) => {
      let filter = f.get('filter');
      if(filter.get('userId') && filter.get('userId') === 'me'){
        filter = filter.set('userId', this.myId);
      }
      const isInFilter = filterGoal(g, filter);
      if(isInFilter){
        f = f.updateIn(['goals'], (goals) => goals.add(g.get('id')));
      } else if(f.get('goals')) {
        f = f.updateIn(['goals'], (goals) => goals.delete(g.get('id')));
      }
      return f;
    })
  }
  storeChange() {
    const state = this.store.getState();
    const orgFilters = state.get('filters');
    let filters = orgFilters;
    const goals = state.get('goals');
    if (goals !== this.previousGoals) {
      this.myId = state.getIn(['me', 'id']);
      this.previousGoals = this.previousGoals || Map();
      goals.forEach((g, k) => {
        const prev = this.previousGoals.get(k);
        if(prev !== g){
          // console.log('goal changed', g.get('title'));
          filters = this.checkAndApplyFiltersForGoal(filters, g);
        }
      })
      this.previousGoals.forEach((g, k) => {
        if(!goals.get(k)){
          // console.log('goal removed', g.get('title'));
          filters = this.removeGoalFromFilters(filters, g);
        }
      })
      this.previousGoals = goals;
    }
    if(filters !== orgFilters){
      this.store.dispatch({ type: types.UPDATE_FILTERS, payload: { filters } });
    }

  }
}
