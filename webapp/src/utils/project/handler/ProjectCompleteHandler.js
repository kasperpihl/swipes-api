import randomString from 'swipes-core-js/utils/randomString';
import projectCompleteItemWithChildren from 'src/utils/project/projectCompleteItemWithChildren';
import projectValidateCompletion from 'src/utils/project/projectValidateCompletion';

import { fromJS } from 'immutable';

export default class ProjectCompleteHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  complete = id => {
    let { order } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id);
    order = projectCompleteItemWithChildren(order, i, true);
    order = projectValidateCompletion(order);
    this.stateManager.update({ order });
  };
  incomplete = id => {
    let { order } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id);
    order = projectCompleteItemWithChildren(order, i, false);
    order = projectValidateCompletion(order);
    this.stateManager.update({ order });
  };

  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
