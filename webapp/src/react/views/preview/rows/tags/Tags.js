import React, { PureComponent, PropTypes } from 'react';
// import { map, list } from 'react-immutable-proptypes';

class Tags extends PureComponent {
  render() {
    let { tags } = this.props;
    tags = tags || [];

    return (
      <div className="tags">
        {tags.map(t => (
          <div className="tags--item">{t}</div>
        ))}
      </div>
    );
  }
}

export default Tags;

const { array } = PropTypes;

Tags.propTypes = {
  tags: array,
};
