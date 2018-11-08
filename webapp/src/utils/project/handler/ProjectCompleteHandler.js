import randomString from 'swipes-core-js/utils/randomString';
import projectIndentItemAndChildren from '../projectIndentItemAndChildren';
import projectUpdateHasChildrenForItem from '../projectUpdateHasChildrenForItem';
import { fromJS } from 'immutable';

export default class ProjectCompleteHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  complete = id => {};
  incomplete = id => {};

  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
