import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Button from 'Button';
import { setupDelegate } from 'classes/utils';
import './styles/workflow-header.scss';

class WorkflowHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rootClass = 'workflow__side';
    this.clickedStart = this.clickedStart.bind(this);
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  clickedStart() {
    this.callDelegate('didPressStart');
  }
  render() {
    const { data } = this.props;

    const { rootClass } = this;

    return (
      <div className={rootClass}>
        <Icon svg={data.get('img')} className="workflow__side__icon workflow__side__icon--svg" />
        <div className={`${rootClass}__title`}>{data.get('title')}</div>
        <div className={`${rootClass}__description`}>{data.get('description')}</div>
        <Button primary text="Start goal" onClick={this.clickedStart} />
      </div>
    );
  }
}

export default WorkflowHeader;

const { string, shape, oneOfType, object, func } = PropTypes;

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
  delegate: object,
};
