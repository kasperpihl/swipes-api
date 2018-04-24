import React from 'react';
import PropTypes from 'prop-types';

import './styles/tags.scss';

const Tags = (props) => {
  let { tags } = props;
  tags = tags || [];

  return (
    <div className="tags">
      {tags.map((t, i) => (
        <div key={i} className="tags__item">{t}</div>
      ))}
    </div>
  );
};

export default Tags;