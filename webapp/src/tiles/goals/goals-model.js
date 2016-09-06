import Immutable from 'immutable'
import { bindAll, randomString } from '../../classes/utils'

export default class GoalsModel {
  constructor(delegate){
    this.goals = new Immutable.List([]);
    bindAll(this, ['add']);
    this.delegate = delegate || function(){};
  }
  defaultProps(){
    return {
      confirmed: false,
      steps: []
    }
  }
  get(){
    return this.model.goals;
  }
  update(){
    
  }
  add(goal){
    var obj = Object.assign(this.defaultProps(), goal, {id: randomString(6)});
    this.goals = this.goals.push(obj);
    this.delegate(this.goals);
    return obj.id;
  }
}