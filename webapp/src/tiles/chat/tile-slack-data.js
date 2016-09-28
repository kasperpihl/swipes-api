import { bindAll, immuCompare } from '../../classes/utils'
import CoreSlackData from '../../classes/slack/core-slack-data'
import SlackSwipesParser from './slack-swipes-parser'
import { fromJS, Map } from 'immutable'
export default class TileSlackData {
  constructor(data){
    this.data = new fromJS(data || {});
    this.parser = new SlackSwipesParser();
    this.typingUsers = {};
    bindAll(this, ['handleMessage', 'notify', 'changedCoreData'])
  }
  loadCoreData(data){
    this.coreSlackData = new CoreSlackData(data);
    this.coreSlackData.onChange = this.changedCoreData;
    this.coreSlackData.notify(); // Force a notify event so that we get the initial state into our tree
  }
  changedCoreData(data){
    this.performChanges((currData) => currData.merge(data));
  }
  beforeChangeHandler(data, newData){
    function changedOr(){
      for(let attr of arguments){
        if(!immuCompare(data, newData, attr))
          return true;
      }
      return false;
    }
    if(changedOr('channels', 'selectedChannelId')){
      newData = newData.set('sectionsForSidemenu', this.parser.sectionsForSidemenu(newData.toJS()));  
    }
    if(changedOr('selectedChannelId', 'sendingMessagesQueue', ['cachedChannels', newData.get('selectedChannelId'), 'messages'])){
      
      newData = newData.set('sortedMessages', this.parser.sortMessagesForSwipes(newData.toJS(), []))
    }
    return newData;
  }
  performChangesIn(keyPath, changeHandler){
    if(typeof keyPath === 'string'){
      keyPath = [ keyPath ];
    }
    var dataToChange = this.data;
    if(keyPath){
      dataToChange = this.data.getIn(keyPath);
      if(typeof dataToChange === 'undefined'){
        if(process.env.NODE_ENV !== 'production'){
          console.warn('performChangesIn, could not find any data for keyPath', keyPath);
        }
        return;
      }
    }
    //console.log(typeof this.data, this.data, );
    let retVal = changeHandler(dataToChange);
    if((!keyPath && Map.isMap(retVal)) || typeof retVal !== 'undefined'){
      if(keyPath){
        retVal = this.data.setIn(keyPath, retVal);
      }
      this.data = this.beforeChangeHandler(this.data, retVal);
      this.notify();
    }
    else{
      console.warn('Called performChanges on TileSlackData without returning the object, ignoring change');
    }
  }
  performChanges(changeHandler){
    this.performChangesIn(null, changeHandler);
  }
  notify(){
    console.log('update', this.data.toJS());
    if(typeof this.onChange === 'function'){
      this.onChange(this.data);
    }
  }
  handleMessage(msg){

    this.coreSlackData.handleMessage(msg);
    //const { messages, unreadIndicator, users, channels, self } = this.data;
    //const currChannel = this.data.channels[this.data.selectedChannelId];
    if(msg.type === 'message'){
      if(msg.channel){
        // Handle message change
        if(msg.subtype === 'message_changed'){
          this.performChangesIn(['cachedChannels', msg.channel, 'messages'], (data) =>{
            console.log('change', msg);
            return data.mergeIn([data.findIndex((item) => item.get('ts') === msg.message.ts)], msg.message);
          })
        }
        else if(msg.subtype === 'message_deleted'){
          this.performChangesIn([ 'cachedChannels', msg.channel, 'messages' ], (data) =>{
            console.log('delete', msg);
            return data.deleteIn([data.findIndex((item) => item.get('ts') === msg.deleted_ts)]);
          })
        }
        else if(this.data.getIn(['cachedChannels', msg.channel])){
          console.log('add', msg);
          this.performChangesIn(['cachedChannels', msg.channel, 'messages'], (data) => {
            return data.push(Map(msg))
          })
        }
      }
    }
    else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
      if(msg.channel === this.data.get('selectedChannelId')){
        this.performChangesIn('unreadIndicator', (data) => {
          const newUnreadIndicator = Object.assign({}, data);
          if(msg.ts < data.ts){
            newUnreadIndicator.showAsRead = false;
            newUnreadIndicator.ts = msg.ts;
          }
          else{
            newUnreadIndicator.showAsRead = true;
          }
          return newUnreadIndicator;
        })
      }
    }
    else if (msg.type === 'user_typing' && msg.channel === this.data.get('selectedChannelId')) {
      this.userTyping(msg);
    }
    // console.log('slack socket handler', msg.type, msg);
  }
  userTyping(data) {
    if (this.typingUsers[data.user]) {
      clearTimeout(this.typingUsers[data.user]);
    }
    
    const timeout = setTimeout(() => {
      delete this.typingUsers[data.user];
      this.userTypingLabel();
    }, 5000);

    this.typingUsers[data.user] = timeout;
    this.userTypingLabel();
  }
  userTypingLabel() {

    const users = Object.keys(this.typingUsers).map((userId) => this.data.getIn(['users', userId, 'name']));
  
    let content = users.join(', ');

    if (users.length > 1) {
      content += ' are typing..';
    } else if (users.length === 1) {
      content += ' is typing..'
    } else{
      content = false;
    }
    this.performChanges((data) => {
      return data.set('typingLabel', content);
    })
  }
  // ========================
  // API Requests
  // ========================
}