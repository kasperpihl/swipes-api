import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';

import './styles/template-item.scss';

class TemplateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.template);
    this.onClick = this.callDelegate.bind(null, 'onTemplateClick');
  }
  render() {
    const { template } = this.props;

    return (
      <div className="template-item" onClick={this.onClick}>
        <div className="template-item__title">{template.title}</div>
        <div className="template-item__message">{template.description}</div>
      </div>
    );
  }
}

export default TemplateItem;
