import React, { Component, PropTypes } from 'react'
import Assigning from '../assigning/Assigning'
import * as Icons from '../icons'
import { randomStatusLabel } from '../../classes/utils'
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
    let assignees = [];

    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].completed) {
        assignees = steps[i].assignees;

        break;
      }
    }

    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={`${rootClass}__image`}>
          {this.renderIcon(data.get('img'))}
        </div>
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{data.get('title')}</div>
          <div className={`${rootClass}__label`}>{randomStatusLabel()}</div>
        </div>
        <div className={`${rootClass}__assigning`}>
          <Assigning assignees={assignees} me={this.props.me.toJS()} />
        </div>
      </div>
    )
  }
}
export default GoalListItem
