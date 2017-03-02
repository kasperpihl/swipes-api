import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';

import './styles/template-item.scss';

class TemplateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.callDelegate('clickedTemplate', this);
  }
  render() {
    const { title, message } = this.props;

    return (
      <div className="template-item" onClick={this.onClick}>
        <div className="template-item__title">{title}</div>
        <div className="template-item__message">{message}</div>
      </div>
    );
  }
}

export default TemplateItem;
