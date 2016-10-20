import React, { Component, PropTypes } from 'react'
import './styles/main.scss'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../constants/ActionTypes'
import { main } from '../../actions'
import { bindAll } from '../../classes/utils'
import Sidemenu from '../../components/sidemenu/Sidemenu'

import SlackData from './slack-data'
import SlackTileHandler from './slack-tile-handler'

import ChatList from './ChatList'
import ChatInput from './ChatInput'
import PureRenderMixin from 'react-addons-pure-render-mixin';
class Chat extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    bindAll(this, ['sendMessage', 'onSelectedRow', 'changedHeight', 'addListenersToSwipes', 'dataDelegate', 'unreadAbove', 'clickedLink', 'onCardShare', 'onCardAction'])
    this.addListenersToSwipes(props.swipes);
    this.slackHandler = new SlackTileHandler(props.swipes, props.tile, this.dataDelegate);
    this.state = { started: false, isStarting: false, inputHeight: 60, data: this.slackHandler.getData() }

    //const data = this.loadDataFromStorage(props.tile.id);
    //this.slackData = new SlackData(this.props.swipes, data, this.dataDelegate);

  }
  dataDelegate(data){
    if(!this.mounted){
      return;
    }
    this.setState({data});
  }
  addListenersToSwipes(swipes){
    swipes.addListener('share.receivedData', (data) => {
      var input = '<' + data.shareUrl;
      if(data.title){
        input += '|' + data.title;
      }
      input += '>';
      this.slackHandler.sendMessage(input);
      this.refs['chat-list'].forceScrollToBottom = true;
    });
    swipes.addListener('send.slackMessage', (data) => {
      this.slackHandler.sendMessage(data.text);
    })
    swipes.addListener('menu.pressed', () => {
      if(this.refs.sidemenu){
        this.refs.sidemenu.togglePin();
      }
    })
  }
  unreadAbove(unread){
    if(this.state.unreadAbove !== unread){
      this.setState({unreadAbove: unread});
    }
  }
  componentDidMount(){
    this.mounted = true;
  }
  componentWillUnmount(){
    this.mounted = false;
    this.slackHandler.destroy();
  }
  componentDidUpdate(prevProps, prevState){
    //console.log('updated', this.props.tile.data);

    const { activeGoal } = this.props;
    if(prevProps.activeGoal !== activeGoal){
      let thread = null;
      if(activeGoal){
        thread = {
          id: activeGoal.get('id'),
          name: activeGoal.get('title'),
          url: window.location.origin + '/g/' + activeGoal.get('id')
        }
      }
      this.slackHandler.setThread(thread);
    }

    const { swipes } = this.props;
    let title = this.slackHandler.titleForChannel();
    if(activeGoal){
      title = activeGoal.get('title');
    }
    if(title !== this.title){
      swipes.sendEvent('navigation.setTitle', title)
      this.title = title;
    }
  }
  changedHeight(height){
    if(this.state.inputHeight !== height){
      this.setState({inputHeight: height});
    }
  }
  sendMessage(message){
    this.refs['chat-list'].forceScrollToBottom = true;
    this.slackHandler.sendMessage(message);
  }
  onCardShare(card, data){
    const { swipes } = this.props;

    const shareData = {};
    if(data.shortUrl){
      shareData.short_url = data.shortUrl;
      // Is a swipes url to reshare
    }
    else if(data.id && data.type){
      shareData.link = {
        service: 'slack',
        id: data.id,
        type: data.type
      }
      shareData.meta = data;
      shareData.permission = {
        type: 'public',
        account_id: swipes.info.workflow.selectedAccountId
      }
      // Is a slack object
    }
    if(Object.keys(shareData).length){
      swipes.sendEvent('share', shareData);
    }
  }
  onCardAction(card, data, action){
    console.log('action', data, action);
  }
  onCardClick(card, data){
    //console.log(this.shareDataForChecksum[data.checksum]);
    if(data.shortUrl){
      const folder = localStorage.getItem('dropbox-folder');
      data = swipesUrlProvider.get(data.shortUrl);
      if(folder){
        var path = folder + data.subtitle + '/' + data.title;
        console.log('opening', window.ipcListener.sendEvent('showItemInFolder', path));
      }
    }

    console.log('clicked', data);
  }
  onSelectedRow(row){
    this.slackHandler.setChannel(row.id);
    document.getElementById('chat-input').focus();
  }
  renderSidemenu(){
    // K_TODO: Update to use internal state;
    const { data } = this.state;
    const sectionsSidemenu = data.get('sectionsForSidemenu') || [];;
    //this.state.sectionsSidemenu || [];
    if(!sectionsSidemenu.length){
      return;
    }
    return (
      <Sidemenu
        parentWidth={this.props.size.width}
        style={{paddingBottom: '10px'}}
        ref="sidemenu"
        onWidthChanged={this.onSidemenuWidthChanged}
        onSelectedRow={this.onSelectedRow}
        data={{sections: sectionsSidemenu }}
      />
    )
  }
  renderUnreadAbove(){
    var unreadClass = "unread-bar";
    if(!this.state.unreadAbove){
      unreadClass += " read";
    }
    return (
      <a key="unread-test" href="#unread-indicator">
        <div className={unreadClass}>Unread messages above <i className="material-icons">arrow_upward</i> </div></a>)
  }
  renderTypingIndicator(label){
    if(label){
      return (
        <div className="typing-indicator">{label}</div>
      )
    }
  }
  clickedLink(command, identifier, title){
    if(command === 'swipes://retry-send'){
      return this.slackHandler.sendMessage();
    }
    if(command.startsWith("@U")){
      var channel = this.slackHandler.channelForUser(command.substring(1));
      if(channel){
        this.slackHandler.setChannel(channel.get('id'));
      }
      return;
    }
    if(command.startsWith("#C")){
      return this.slackHandler.setChannel(command.substring(1));
    }
    console.log('command', command);
    if(command.startsWith(window.location.origin + '/g/')){
      return this.props.setActiveGoal(command.split('/g/')[1]);
    }
    const { swipes } = this.props;
    swipes.sendEvent('openURL', {url: command})
  }
  renderList(){
    const { data } = this.state;
    
    return (
      <ChatList
        ref="chat-list"
        cardDelegate={this}
        thread={data.get('thread')}
        sections={data.get('sortedMessages')}
        markAsRead={this.slackHandler.markAsRead}
        loadingMessages={data.get('loadingMessages')}
        unreadAbove={this.unreadAbove}
        unreadIndicator={data.get('unreadIndicator')}
        clickedLink={this.clickedLink}
      />
    )
  }
  renderThreadHeader(){
    
  }
  render() {

    const { data } = this.state;
    const { inputHeight } = this.state;
    let paddingBottom = inputHeight + 20;
    this.renderThreadHeader();
    return (
      <div style={{position: 'relative', height :'100%', paddingBottom: paddingBottom + 'px'}}>
        {this.renderSidemenu()}
        {this.renderUnreadAbove()}
        {this.renderList()}
        <ChatInput
          sendMessage={this.sendMessage}
          parentWidth={this.props.size.width}
          changedHeight={this.changedHeight}
          uploadFiles={this.slackHandler.uploadFiles}
          sendTypingEvent={this.slackHandler.sendTypingEvent}
        />
        {this.renderTypingIndicator(data.get('typingLabel'))}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    goals: state.get('goals'),
    activeGoal: state.getIn(['goals', state.getIn(['main', 'activeGoal'])])
  }
}

const ConnectedChat = connect(mapStateToProps, {
  setActiveGoal: main.setActiveGoal
})(Chat)
export default ConnectedChat

