import React, { PropTypes } from 'react';
// import { map, list } from 'react-immutable-proptypes';

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

const { array } = PropTypes;

Tags.propTypes = {
  tags: array,
};
