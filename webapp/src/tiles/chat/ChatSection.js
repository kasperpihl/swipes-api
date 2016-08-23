import React, { Component, PropTypes } from 'react'
import ChatItem from './ChatItem'

export default class ChatSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    var chatItems = [];
    const { clickedLink } = this.props;
    const { section, unreadIndicator } = this.props.data;
    section.messages.forEach((item, i) => {
      if(!item.hidden){
        chatItems.push(<ChatItem key={item.key} clickedLink={clickedLink} data={item} />);
      }

      if(item.ts && unreadIndicator && item.ts === unreadIndicator.ts && !item.isLastMessage){
        
        var className = "new-message-header";
        if(unreadIndicator.showAsRead){
          className += " read";
        }
        chatItems.push(<div id="unread-indicator" className={className} key="new-message-header"><span>new messages</span></div>);
        chatItems.push(<div key="new-message-post-header" className="new-message-post-header" />);
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
  clickedLink: PropTypes.func,
  data: PropTypes.shape({
    section: PropTypes.shape({
      title: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
  }).isRequired
}