import React, { Component, PropTypes } from 'react'
import { bindAll, debounce } from '../../classes/utils'

import ChatSection from './ChatSection'

class ChatList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.shouldScrollToBottom = true;
    this.hasRendered = false;
    bindAll(this, ['onScroll', 'scrollToBottom', 'handleResize', 'checkForMarkingAsRead'])
    this.bouncedScroll = debounce(this.scrollToBottom, 100);
    const markAsRead = (typeof props.markAsRead === 'function') ? props.markAsRead : () => {};
    this.bouncedMarkAsRead = debounce(markAsRead, 500);
  }
  
  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
  }
  componentDidUpdate(prevProps, prevState){
    this.scrollToBottom(this.hasRendered);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  checkForMarkingAsRead(){
    // Check for unread marker
    const scrollPos = this.refs['scroll-container'].scrollTop
    const viewHeight = this.refs['scroll-container'].clientHeight
    const messageHeaderEl = this.refs['scroll-container'].querySelector('.new-message-header');
    if(messageHeaderEl){
      const posForUnread = messageHeaderEl.getBoundingClientRect().top - scrollPos;
      if(posForUnread > 0 && posForUnread < viewHeight){
        this.bouncedMarkAsRead()
      }
    }
  }
  handleResize(){
    this.bouncedScroll(this.hasRendered);
  }
  scrollToBottom(animate){
    const chatList = this.refs['chat-list']
    const scrollContainer = this.refs['scroll-container'];

    var scrollPosForBottom = chatList.clientHeight - scrollContainer.clientHeight
    if(scrollPosForBottom > 0 && this.shouldScrollToBottom && scrollPosForBottom != scrollContainer.scrollTop ){
      this.hasRendered = true;
      if(animate){
        scrollContainer.scrollTop = scrollPosForBottom;
        //$('.chat-list-container').animate({ scrollTop: scrollPosForBottom }, 50);
      }
      else{
        scrollContainer.scrollTop = scrollPosForBottom;
      }
    }
    var topPadding = 0;
    if(chatList.clientHeight < scrollContainer.clientHeight){
      topPadding = scrollContainer.clientHeight - chatList.clientHeight;
      if(topPadding != this.state.topPadding){
        this.setState({topPadding: topPadding});
      }
    }
  }
  onScroll(e){
    const contentHeight = this.refs['chat-list'].clientHeight
    const scrollPos = this.refs['scroll-container'].scrollTop
    const viewHeight = this.refs['scroll-container'].clientHeight

    if( (viewHeight+scrollPos) >= contentHeight ){
      this.shouldScrollToBottom = true;
    }
    else{
      this.shouldScrollToBottom = false;
    }

    this.checkForMarkingAsRead();
  }

  renderLoading(){
    if(!this.props.sections){
      return <div>Loading</div>
    }
  }
  renderSections(){
    const { unreadIndicator, sections, itemDelegate } = this.props;
    if(sections){
      return sections.map(function(section){
        return <ChatSection key={section.title} itemDelegate={itemDelegate} data={{unreadIndicator: unreadIndicator, section: section}} />
      });
    }
  }
  render() {
    const styles = {};
    if(this.state.topPadding){
      //styles.paddingTop = this.state.topPadding + "px"
    }
    return (
      <div onScroll={this.onScroll} style={styles} ref="scroll-container" className="chat-list-container">
        {this.renderLoading()}
        <div className="chat-list" ref="chat-list">
          {this.renderSections()}
        </div>
      </div>
    );
  }
}
export default ChatList

ChatList.propTypes = {
  itemDelegate: PropTypes.object.isRequired,
  markAsRead: PropTypes.func,
  sections: PropTypes.arrayOf(PropTypes.shape({

  }))

}
