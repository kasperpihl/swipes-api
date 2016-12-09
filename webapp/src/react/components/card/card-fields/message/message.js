import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';
import './styles/message.scss';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;

    return (
      <div className="card-message">
        <div className="card-message__profile-image">
          <img src={data.get('image')} alt={data.get('name')} className="card-message__image" />
        </div>
        <div className="card-message__content">
          <div className="card-message__info">
            <div className="card-message__name">{data.get('name')}</div>
            <div className="card-message__time">{data.get('timestamp')}</div>
          </div>
          <div className="card-message__message">{data.get('message')}</div>
        </div>
      </div>
    );
  }
}

export default Message;

const { string } = PropTypes;

Message.propTypes = {
  data: mapContains({
    image: string,
    name: string,
    timestamp: string,
    message: string,
  }),
};
