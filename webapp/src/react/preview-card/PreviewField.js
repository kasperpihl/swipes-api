import React, { Component, PropTypes } from 'react';

class PreviewField extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { children, title } = this.props;
    return (
      <div className="preview-field">
        {children}
      </div>
    );
  }
}

export default PreviewField;

const { string, object } = PropTypes;

PreviewField.propTypes = {
  title: string,
  children: object,
};
