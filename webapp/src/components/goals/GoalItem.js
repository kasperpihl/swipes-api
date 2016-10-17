import React, { Component, PropTypes } from 'react'
import './styles/goal-item.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class GoalItem extends Component {
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
  render() {
    const { data } = this.props;
    let rootClass = 'goal-item';
    
    return (
      <div className={rootClass} onClick={this.clickedListItem}>
        <div className={rootClass + "__image"}>
          <img src={data.get('img')} />
        </div>
        <div className={rootClass + "__content"}>
          <div className={rootClass + "__title"}>{data.get('title')}</div>
          <div className={rootClass + "__label"}>2/3 steps</div>
        </div>
      </div>
    )
  }
}

export default GoalItem

const { string } = PropTypes;

GoalItem.propTypes = {
  // removeThis: string.isRequired
}
