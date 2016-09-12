import React, { Component, PropTypes } from 'react'
import ChatItem from './ChatItem'

export default class ChatSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    var chatItems = [];
    const { clickedLink, cardDelegate } = this.props;
    const { section, unreadIndicator } = this.props.data;
    var unreadSectionClass = ""
    var chatLineContainerClass = ''
    section.messages.forEach((item, i) => {
      if(unreadIndicator && item.isFirstUnreadMessage){
        var unreadClass = ' seperator-line--unread';

        if(unreadIndicator.showAsRead){
          unreadClass = ' seperator-line--read';
        }
        if(i > 0){
          unreadClass += ' js-unread-class'

          chatItems.push(
            <div className={"seperator-line seperator-line--new" + unreadClass} key="new-message-header">
              <div className="seperator-line__line"></div>
              <div className="seperator-line__message">New Messages</div>
            </div>
          )
        }
        else{
          unreadSectionClass = unreadClass;
          chatLineContainerClass += ' js-unread-class'
        }
      }
      if(!item.hidden){
        chatItems.push(<ChatItem key={item.key} cardDelegate={cardDelegate} clickedLink={clickedLink} data={item} />);
      }
    });

    return (
      <div className="section">
        <div className={"seperator-line seperator-line--date" + chatLineContainerClass + unreadSectionClass}>
          <div className="seperator-line__line"></div>
          <div className="seperator-line__message">{section.title}</div>
        </div>

        {chatItems}
      </div>
    );
  }
}

ChatSection.propTypes = {
  cardDelegate: PropTypes.object.isRequired,
  clickedLink: PropTypes.func,
  data: PropTypes.shape({
    section: PropTypes.shape({
      title: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
  }).isRequired
}
