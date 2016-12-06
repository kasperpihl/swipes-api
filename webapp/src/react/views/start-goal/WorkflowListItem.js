import React, { Component, PropTypes } from 'react';
import Icon from '../../icons/Icon';
import './styles/workflow-list-item.scss';

class WorkflowListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callback = this.callback.bind(this);
  }
  componentDidMount() {
  }
  callback() {
    this.props.callback(this.props.data.id);
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="workflow__item__icon workflow__item__icon--svg" />;
  }
  render() {
    const { img, title, description } = this.props.data;
    const rootClass = 'workflow__item'; // Trying something new here because of BEM

    return (
      <div className={rootClass} onClick={this.callback}>
        {this.renderIcon(img)}
        <div className={`${rootClass}__content`}>
          <div className={`${rootClass}__title`}>{title}</div>
          <div className={`${rootClass}__description`}>{description}</div>
        </div>
      </div>
    );
  }
}

export default WorkflowListItem;

const { shape, oneOfType, string, func } = PropTypes;
WorkflowListItem.propTypes = {
  data: shape({
    img: oneOfType([
      string,
      func,
    ]),
    title: string,
    subtitle: string,
  }),
  callback: func,
};
