import React, { Component, PropTypes } from 'react'
import { bindAll, debounce } from '../../classes/utils'
import Loader from '../../components/swipes-ui/Loader'
import ChatSection from './ChatSection'

class ChatList extends Component {
  constructor(props) {
    super(props)
    this.state = {unreadAbove: false}
    bindAll(this, ['onScroll', 'checkForMarkingAsRead'])
    const markAsRead = () => {
      if(this.props.markAsRead){
        this.props.markAsRead();
      }
    };
    this.bouncedMarkAsRead = debounce(markAsRead, 500);
  }

  componentWillUpdate(nextProps, nextState){
    const node = this.refs['scroll-container'];
    this.shouldScrollBottom = this.forceScrollToBottom || node.scrollTop + node.offsetHeight === node.scrollHeight;
    this.forceScrollToBottom = false;
  }
  componentDidUpdate(prevProps, prevState){
    if (this.shouldScrollBottom) {
      const node = this.refs['scroll-container'];
      node.scrollTop = node.scrollHeight
    }

  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  checkForMarkingAsRead(){
    const { unreadIndicator } = this.props;
    let unreadAbove = false;
    // Check for unread marker
    const scrollPos = this.refs['scroll-container'].scrollTop
    const viewHeight = this.refs['scroll-container'].clientHeight
    const messageHeaderEl = this.refs['scroll-container'].querySelector('.js-unread-class');
    if(messageHeaderEl){
      const posForUnread = messageHeaderEl.offsetTop - scrollPos;
      if(document.hasFocus() && posForUnread > 0 && posForUnread < viewHeight){
        this.bouncedMarkAsRead()
      }
      if(posForUnread < 0 && !unreadIndicator.showAsRead){
        unreadAbove = true;
      }
    }
    if(this.props.unreadAbove){
      this.props.unreadAbove(unreadAbove);
    }
  }
  onScroll(e){
    this.checkForMarkingAsRead();
  }

  renderLoading(){
    if(!this.props.sections || this.props.loadingMessages){
      return <Loader size={60} text="Loading" center={true}/>
    }
  }
  renderSections(){
    let { unreadIndicator, sections, itemDelegate, clickedLink, loadingMessages, cardDelegate } = this.props;
    if(sections && !sections.length){
      return <div className="chat-list__no-messages">This is the very beginning of this conversation. Start writing below</div>;
    }
    if(sections && !loadingMessages){
      return sections.map(function(section){
        return <ChatSection cardDelegate={cardDelegate} key={section.title} clickedLink={clickedLink} data={{unreadIndicator: unreadIndicator, section: section}} />
      });
    }
  }
  render() {
    const styles = {};
    if(this.state.topPadding){
      styles.paddingTop = this.state.topPadding + "px"
    }
    return (
      <div onScroll={this.onScroll} style={styles} ref="scroll-container" className="chat-list-container">
        {this.renderLoading()}
        <div className="flex-container">
          <div className="chat-list" ref="chat-list">
            {this.renderSections()}
          </div>
        </div>
      </div>
    );
  }
}
export default ChatList

ChatList.propTypes = {
  cardDelegate: PropTypes.object.isRequired,
  markAsRead: PropTypes.func,
  clickedLink: PropTypes.func,
  unreadAbove: PropTypes.func,
  sections: PropTypes.arrayOf(PropTypes.object)

}
