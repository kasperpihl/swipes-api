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
    var unreadSectionClass = ""
    var chatLineContainerClass = 'chat-date-line'
    section.messages.forEach((item, i) => {
      
      if(unreadIndicator && item.isFirstUnreadMessage && !item.isLastMessage){
        var unreadClass = "new-message-header";

        if(unreadIndicator.showAsRead){
          unreadClass += " read";
        }
        if(i > 0){
          unreadClass += ' js-unread-class'
          console.log('unread added normally');
          chatItems.push(<div id="unread-indicator" className={unreadClass} key="new-message-header"><span>new messages</span></div>);
          chatItems.push(<div key="new-message-post-header" className="new-message-post-header" />);
        }
        else{
          unreadSectionClass = unreadClass;
          chatLineContainerClass += ' js-unread-class'
          console.log('item was unread and first section');
        }
      }
      if(!item.hidden){
        chatItems.push(<ChatItem key={item.key} clickedLink={clickedLink} data={item} />);
      }
    });

    return (
      <div className="section">
        <div className={chatLineContainerClass}>
          <div className={"line " + unreadSectionClass}></div>
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
