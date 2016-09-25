import { bindAll, randomString } from '../../classes/utils'
import TileSlackData from './tile-slack-data'
import { fromJS, List, Map } from 'immutable'

export default class SlackTileHandler {
  constructor(swipes, tile, onChange){
    this.tile = tile;
    this.swipes = swipes;
    const data = {};
    data.selectedChannelId = localStorage.getItem(tile.id + '-selectedChannelId');
    
    this.tileSlackData = new TileSlackData(data);
    this.tileSlackData.onChange = onChange;
    
    this.sendingMessagesQueue = [];
    
    window.slack.connect(tile.selectedAccountId, (method, data) => {
      if(method === 'init'){
        console.log(method, data);
        this.tileSlackData.loadCoreData(data);
        this.start();
      }
      if(method === 'socketMessage'){
        this.tileSlackData.handleMessage(data);
      }
    }, tile.id);
    bindAll(this, ['markAsRead', 'uploadFiles', 'fetchMessages', 'destroy', 'sendTypingEvent', 'sendMessage', 'addItemToQueue'])
  }
  getData(){
    return this.tileSlackData.data;
  }
  start(){
    const { data } = this.tileSlackData; 
    if(!data.get('selectedChannelId') || data.getIn(['channels', data.get('selectedChannelId'), 'is_archived'])){
      this.setChannel(data.get('channels').find((channel) => {
        return channel.get('is_general')
      }).get('id'));
    }
    else{
      this.setChannel(data.get('selectedChannelId'), true);
    }
  }
  setChannel(channelId, force){
    const { data } = this.tileSlackData; 
    const channel = data.getIn(['channels', channelId]);
    if(!force && channel.get('id') === data.get('selectedChannelId')){
      return;
    }
    this.tileSlackData.performChanges((oldData) => {
      let nD = oldData.set('selectedChannelId', channelId);
      if(!oldData.getIn(['cachedChannels', channelId, 'messages'])){
        nD = nD.set('loadingMessages', true);
      }
      nD = nD.set('unreadIndicator', {ts: channel.get('last_read')})
      return nD;
    })
    this.swipes.sendEvent('navigation.setTitle',this.tileSlackData.parser.titleForChannel(channel.toJS(), this.getData().get('users').toJS()));
    localStorage.setItem(this.tile.id + '-selectedChannelId', channelId);
    this.fetchMessages(channel);
  }
  sendTypingEvent() {
    const { data } = this.tileSlackData;
    window.slack.sendEvent(this.tile.selectedAccountId, {'id': '1', 'type': 'typing', 'channel': data.get('selectedChannelId')});

  }

  apiPrefixForChannel(channel){
    if(channel.get('is_im')){
      return "im."
    }
    if(channel.get('is_group')){
      return "groups.";
    }
    return "channels.";
  }
  currentChannel(){
    const { data } = this.tileSlackData;
    return data.getIn(['channels', data.get('selectedChannelId')]);
  }
  currentMessages(){
    const { data } = this.tileSlackData;
    return data.getIn(['cachedChannels', data.get('selectedChannelId'), 'messages']);
  }
  markAsRead(ts){

    const messages = this.currentMessages();
    var channel = this.currentChannel();
    ts = ts || messages.last().get('ts');
    
    if(!channel || ts === channel.get('last_read')){
      return;
    }
    var prefix = this.apiPrefixForChannel(channel);
    this.swipes.service('slack').request(prefix + "mark",
      {
        channel: channel.get('id'),
        ts: ts
    })
  }
  fetchMessages(channel){
    this.swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.get('id'), count: 50 }).then((res) => {
      if(res.ok){
        this.tileSlackData.performChanges((oldData) => {
          let nD = oldData.set('loadingMessages', false);
          res.data.messages = res.data.messages.sort((a, b) => (a.ts < b.ts) ? -1 : 1);
          nD = nD.mergeIn(['cachedChannels', channel.get('id')], fromJS(res.data));
          return nD;
        })
        //this.saveData({messages: res.data.messages, loadingMessages: false})
      }
    }).catch(function(error){
      console.log(error);
    });

  }
  destroy(){
    window.slack.disconnect(null, null, this.tile.id);
  }


  uploadFiles(files, callback){
    const { data } = this.tileSlackData;

    console.log('uploading', files)
    const file = files[0];
    const token = this.swipes.info.slackToken;
    const formData = new FormData();
    formData.append("token", token);
    formData.append("channels", data.get('selectedChannelId'));
    formData.append("filename", file.name);
    formData.append("title", file.name);
    formData.append("file", file);

    const item = {
      type: 'file',
      message: file.name,
      status: 'Uploading'
    }
    let uploadingId = this.addItemToQueue(item);
    this.__tempSlackUpload(formData, (res, err) => {
      if(res.ok){
        this.removeItemFromQueue(uploadingId);
      }
      else{
        this.updateItemInQueue(uploadingId, {status: 'Failed'});
      }
      if(callback){
        callback(res, err);
      }
    });
  }
  sendMessage(message){
    if(message){
      this.addItemToQueue({type: 'message', 'status': 'Waiting', message: message});
    }
    this._sendNextMessage();
  }
  _sendNextMessage(){
    const { data } = this.tileSlackData;
    let nextItem = this.getNextItemFromQueue('message', data.get('selectedChannelId'));
    if(!nextItem || nextItem.get('status') === 'Sending'){
      return;
    }
    nextItem = nextItem.toJS();
    const { id, message, channel } = nextItem;

    this.updateItemInQueue(id, {status: 'Sending'});
    this.swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: channel, as_user: true, link_names: 1}, (res, err) => {
      if(res && res.ok){
        console.log(res);
        this.tileSlackData.performChanges((data) => {
          return data.set('unreadIndicator', {ts: res.data.ts});
        })
        this.markAsRead(res.data.ts);
        this.removeItemFromQueue(id);
        this.swipes.sendEvent('analytics.action', {name: "Send message"});

        this._sendNextMessage();
      }
      else{
        console.log('updating failed item', id);
        this.updateItemInQueue(id, {status: 'Failed'});
      }

    });
  }
  addItemToQueue(item){
    const { data } = this.tileSlackData;
    item.id = randomString(6);
    item.channel = data.get('selectedChannelId');
    item.createdAt = new Date().getTime();
    this.tileSlackData.performChanges((oldD) => {
      return oldD.update('sendingMessagesQueue', new List(), (queue) => queue.push(Map(item)))
    })
    return item.id;
  }
  getNextItemFromQueue(type, channel){
    return this.getData().get('sendingMessagesQueue').find((item) => {
      return (item.get('channel') === channel && item.get('type') === type);
    })
  }
  removeItemFromQueue(id){
    this.tileSlackData.performChangesIn('sendingMessagesQueue', (oldD) => {
      return oldD.deleteIn([oldD.findIndex((i) => i.get('id') === id)]);
    })
  }
  updateItemInQueue(id, data){
    this.tileSlackData.performChangesIn('sendingMessagesQueue', (oldD) => {
      return oldD.mergeIn([oldD.findIndex((i) => i.get('id') === id)], data);
    })
  }

  // T_INFO // We should replace these once we can upload directly through our service
  // Though, the request might come in handy for how to send the request since they use formData for files.
  __tempSlackUpload(formData, callback){

    var url = 'https://slack.com/api/files.upload';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onload = function(e) {
      var data = JSON.parse(e.currentTarget.response);
      console.log('slack /files.upload success', data);
      if(typeof callback === 'function'){
        if(data && data.ok){
          callback(data)
        }
        else{
          callback(false, data)
        }
      }
    };

    xhr.onerror = function(e) {
      var error = e; //T_TODO make sure that the `e` is actually the error
      console.log('slack /files.upload error', error);
      if(error.responseJSON)
        error = error.responseJSON;
      if(typeof callback === 'function')
        callback(false, error);
    };

    xhr.send(formData);
  }
}