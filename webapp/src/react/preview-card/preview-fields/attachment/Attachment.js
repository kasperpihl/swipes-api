import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';
import Icon from 'Icon';

import './styles/attachment.scss';

class Attachment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { data, onClick } = this.props;
    if (onClick) {
      onClick(data, e);
    }
  }
  renderIcon() {
    return <Icon svg="Hyperlink" className="card-attachment__icon" />;
  }
  render() {
    const { data } = this.props;

    return (
      <div className="card-attachment" onClick={this.onClick}>
        {this.renderIcon()}
        <div className="card-attachment__title">{data.get('title')}</div>
      </div>
    );
  }
}

export default Attachment;

const { string, func } = PropTypes;

Attachment.propTypes = {
  data: mapContains({
    title: string,
  }),
  onClick: func,
};
