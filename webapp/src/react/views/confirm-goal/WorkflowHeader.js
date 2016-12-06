import React, { Component, PropTypes } from 'react';
import Icon from '../icons/Icon';
import './styles/workflow-header.scss';

class WorkflowHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rootClass = 'workflow__side';
    this.clickedStart = this.clickedStart.bind(this);
  }
  clickedStart() {
    this.props.callDelegate('didPressStart');
  }
  render() {
    const { title, img, description, disabled } = this.props.data;
    const { rootClass } = this;
    let btnClass = `${rootClass}__button `;

    if (disabled) {
      btnClass += `${rootClass}__button--disabled`;
    }

    return (
      <div className={rootClass}>
        <Icon svg={img} className="workflow__side__icon workflow__side__icon--svg" />
        <div className={`${rootClass}__title`}>{title}</div>
        <div className={`${rootClass}__description`}>{description}</div>
        <div className={btnClass} onClick={this.clickedStart}>StArT GoAl</div>
      </div>
    );
  }
}

export default WorkflowHeader;

const { string, shape, oneOfType, func } = PropTypes;

WorkflowHeader.propTypes = {
  data: shape({
    title: string,
    subtitle: string,
    img: oneOfType([string, func]),
    creator: shape({
      author: string,
      time: string,
    }),
    description: string,
  }),
  callDelegate: func,
};
