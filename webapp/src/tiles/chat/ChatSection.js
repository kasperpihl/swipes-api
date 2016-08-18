import React, { Component, PropTypes } from 'react'
import ChatItem from './ChatItem'

export default class ChatSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    var chatItems = [];
    const { itemDelegate } = this.props;
    const { section, unreadIndicator } = this.props.data;
    section.messages.forEach((item, i) => {
      if(!item.hidden){
        chatItems.push(<ChatItem key={item.ts} data={item} delegate={itemDelegate} />);
      }
      if(unreadIndicator && item.ts === unreadIndicator.ts && !item.isLastMessage){
        var className = "new-message-header";
        var unreadClass = "unread-bar";
        if(unreadIndicator.showAsRead){
          className += " read";
          unreadClass += " read";
        }
        chatItems.push(<div className={className} key="new-message-header"><span>new messages</span></div>);
        chatItems.push(<div key="new-message-post-header" className="new-message-post-header" />);
        chatItems.push(<a href={'#' + item.ts}><div className={unreadClass}>you have unread messages <i className="material-icons">arrow_upward</i> </div></a>);
      }
    });

    return (
      <div className="section">
        <div className="chat-date-line">
          <div className="line"></div>
          <div className="date">
            <span>{section.title}</span>
          </div>
        </div>
        {chatItems}
      </div>
    );
  }
}

ChatSection.propTypes = {
  itemDelegate: PropTypes.object.isRequired,
  data: PropTypes.shape({
    section: PropTypes.shape({
      title: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.shape({
        ts: PropTypes.string.isRequired
      }))
    }).isRequired
  }).isRequired
}