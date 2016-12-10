import React, { PropTypes } from 'react';

import './styles/preview-field';

const PreviewField = (props) => {
  const { children, title } = props;

  return (
    <div className="preview-field">
      <div className="preview-field__header">
        <div className="preview-field__title">{title}</div>
      </div>

      {children}
    </div>
  );
};

export default PreviewField;

const { string, object } = PropTypes;

PreviewField.propTypes = {
  title: string,
  children: object,
};
