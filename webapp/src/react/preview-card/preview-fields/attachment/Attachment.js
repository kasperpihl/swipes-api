import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';
import Icon from 'Icon';

import './styles/attachment.scss';

class Attachment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon() {
    return <Icon svg="ThreeDotsIcon" className="card-attachment__icon" />;
  }
  render() {
    const { data } = this.props;

    return (
      <div className="card-attachment">
        {this.renderIcon()}
        <div className="card-attachment__title">{data.get('title')}</div>
      </div>
    );
  }
}

export default Attachment;

const { string } = PropTypes;

Attachment.propTypes = {
  data: mapContains({
    title: string,
  }),
};
