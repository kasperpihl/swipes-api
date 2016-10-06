import React, { Component, PropTypes } from 'react'
import './styles/goal-item.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class GoalItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    
  }
  componentDidMount() {
  }
  render() {
    const { data } = this.props;
    let rootClass = 'goal';

    return (
      <div className={rootClass}>
        <div className="goal__image">
          <img src={data.get('img')} />
        </div>
        <div className="goal__content">
          <div className="goal__title">{data.get('title')}</div>
          <div className="goal__progress"></div>
          <div className="goal__label">{data.get('status')}</div>
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
