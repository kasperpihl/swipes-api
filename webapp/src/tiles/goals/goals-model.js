import Immutable from 'immutable'
import { randomString } from '../../classes/utils'

export default class GoalsModel {
  constructor(delegate){
    this.state = new Immutable.map({});
    this.delegate = delegate || function(){};
  }
  addGoal(type){
    
  }
  saveData(data, options){
    
    this.delegate(JSON.parse(JSON.stringify(data)), options);
  }
}