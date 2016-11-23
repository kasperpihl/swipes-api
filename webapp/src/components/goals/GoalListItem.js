import React, { Component, PropTypes } from 'react'
import Assigning from '../assigning/Assigning'
import * as Icons from '../icons'
import PureRenderMixin from 'react-addons-pure-render-mixin';

import * as gUtils from './goals_utils'

import './styles/goal-list-item.scss'

class GoalListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedListItem = this.clickedListItem.bind(this);
  }
  clickedListItem(){
    const { onClick, data } = this.props;
    if(onClick){
      onClick(data.get('id'));
    }
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];
    if(Comp){
      return <Comp className="goal-list-item__icon goal-list-item__icon--svg"/>;
    }
    return <i className="material-icons goal-list-item__icon goal-list-item__icon--font">{icon}</i>
  }
  render() {
    const { data } = this.props;
    let rootClass = 'goal-list-item';
    const steps = data.get('steps').toJS();
    const step = data.getIn(['steps', data.get('currentStepIndex')]);
    const assignees = step.get('assignees').toJS();
    const status = gUtils.getStatusForCurrentStep(data, this.props.me.get('id'));
    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={`${rootClass}__image`}>
          {this.renderIcon(data.get('img'))}
        </div>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{data.get('title')}</div>
          <div className={`${rootClass}__label`}>{status}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <Assigning assignees={assignees} me={this.props.me.toJS()} />
        </div>
      </div>
    )
  }
}
export default GoalListItem
