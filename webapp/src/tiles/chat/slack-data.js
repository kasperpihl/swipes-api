import { bindAll, indexBy, randomString } from '../../classes/utils'
import { getTimeStr, dayStringForDate, startOfDayTs, isAmPm } from '../../classes/time-utils'
import SlackSocket from './slack-socket'
import SlackSwipesParser from './slack-swipes-parser'

export default class SlackData {
  constructor(swipes, data, delegate){
    this.swipes = swipes;
    this.data = data || {};
    this.sendingMessagesQueue = [];

    this.typingUsers = {};
    bindAll(this, ['start', 'handleMessage', 'uploadFiles', 'markAsRead', 'getUserFromId', 'titleForChannel', 'fetchMessages', 'setChannel', 'deleteMessage', 'editMessage', 'openImage', 'loadPrivateImage', 'userTyping', 'userTypingLabel', 'sendTypingEvent', 'destroy'])
    this.socket = new SlackSocket(this.start, this.handleMessage);
    this.delegate = delegate || function(){};
    this.parser = new SlackSwipesParser();
    this.start();
  }
  destroy(){
    this.socket.destroy();
    this.delegate = () => {}
  }
  saveData(data, options){
    if(data.messages){
      data.messages = data.messages.sort((a, b) => (a.ts < b.ts) ? -1 : 1)
    }
    this.data = Object.assign(this.data, data);
    if(data.channels || data.selectedChannelId){
      this.data.sectionsSidemenu = data.sectionsSidemenu = this.parser.sectionsForSidemenu(this.data);
    }
    if( data.messages || data.unreadIndicator ){
      this.data.sortedMessages = data.sortedMessages = this.parser.sortMessagesForSwipes(this.data, this.sendingMessagesQueue);
    }
    this.delegate(JSON.parse(JSON.stringify(data)), options);
  }
  clearDelegate(){
    this.delegate = () => {};
  }
  start(){
    if(this.isStarting){
      return;
    }
    this.isStarting = true;
    this.swipes.service('slack').request('rtm.start').then((res, err) => {
      this.isStarting = false;
      if(res.ok){
        const saveObj = { channels: {} };
        const keysToSave = [ 'team', 'users', 'self', 'bots', 'channels', 'groups', 'ims' ]
        let generalChannelId;
        Object.keys(res.data).forEach((key) => {
          if(keysToSave.indexOf(key) !== -1){
            let value = res.data[key];
            if(Array.isArray(value)){
              value = indexBy(value, (obj) => {
                if(key === 'channels' && obj.is_general){
                  generalChannelId = obj.id;
                }
                return obj.id;
              })
              if(['channels', 'groups', 'ims'].indexOf(key) > -1){
                key = 'channels';
                value = Object.assign(saveObj['channels'], value);
              }
            }
            saveObj[key] = value;
          }
        });
        this.saveData(saveObj);
        this.socket.connect(res.data.url);

        // Set general channel if no channels have been selected, or selected channel is archived.
        if(!this.data.selectedChannelId || saveObj['channels'][this.data.selectedChannelId].is_archived){
          this.setChannel(generalChannelId);
        }else{
          this.setChannel(this.data.channels[this.data.selectedChannelId], true);
        }

      }
    })
  }
  setChannel(channel, force){
    if(typeof channel === 'string'){
      channel = this.data.channels[channel];
    }
    if(!force && channel.id === this.data.selectedChannelId){
      return;
    }
    const data = {
      selectedChannelId: channel.id,
      loadingMessages: true,
      unreadIndicator: {ts: channel.last_read}
    };
    this.saveData(data);
    this.fetchMessages(channel);
  }
  currentChannel(){
    return this.data.channels[this.data.selectedChannelId];
  }

  markAsRead(ts){
    const { messages } = this.data;
    var channel = this.currentChannel();

    ts = ts || messages[messages.length - 1].ts;
    if(!channel || ts === channel.last_read){
      return;
    }
    var prefix = this.apiPrefixForChannel(channel);
    this.swipes.service('slack').request(prefix + "mark",
      {
        channel: channel.id,
        ts: ts
    })
    .then(() => {
    })
  }
  fetchMessages(channel){
    this.swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id, count: 50 }).then((res) => {
      if(res.ok){
        this.saveData({messages: res.data.messages, loadingMessages: false})
      }
    }).catch(function(error){
      console.log(error);
    });

  }
  uploadFiles(files, callback){
    console.log('uploading', files)
    const file = files[0];
    const token = this.swipes.info.slackToken;
    const formData = new FormData();
    formData.append("token", token);
    formData.append("channels", this.data.selectedChannelId);
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

    const nextItem = this.getNextItemFromQueue('message', this.data.selectedChannelId);
    if(!nextItem || nextItem.status === 'Sending'){
      return;
    }
    const { id, message, channel } = nextItem;

    this.updateItemInQueue(id, {status: 'Sending'});
    this.swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: channel, as_user: true, link_names: 1}, (res, err) => {
      if(res && res.ok){
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
    item.id = randomString(6);
    item.channel = this.data.selectedChannelId;
    item.createdAt = new Date().getTime();
    this.sendingMessagesQueue.push(item);
    this.updateSortedMessages();
    return item.id;
  }
  getNextItemFromQueue(type, channel){
    let foundItem;
    this.sendingMessagesQueue.forEach((item) => {
      if(!foundItem && item.type === type && item.channel === channel){
        foundItem = item;
      }
    })
    return foundItem;
  }
  removeItemFromQueue(id){
    this.sendingMessagesQueue = this.sendingMessagesQueue.filter((i) => i.id != id)
    this.updateSortedMessages();
  }
  updateItemInQueue(id, data){
    this.sendingMessagesQueue = this.sendingMessagesQueue.map((i) => {
      if(id === i.id){
        i = Object.assign(i, data);
      }
      return i;
    })
    this.updateSortedMessages();
  }
  updateSortedMessages(){
    const sortedMessages = this.parser.sortMessagesForSwipes(this.data, this.sendingMessagesQueue);
    this.saveData({ sortedMessages });
  }


  deleteMessage(timestamp){
    const { selectedChannelId } = this.data;
    const messages = this.data.messages.filter((obj) => (obj.ts !== timestamp));
    this.saveData({messages})

    swipes.service('slack').request('chat.delete', { ts: timestamp, channel: selectedChannelId}, (res, err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  editMessage(message, timestamp) {
    swipes.modal('edit')('Edit Message', message, (res) => {
      if (res) {
        swipes.service('slack').request('chat.update', { ts: timestamp, channel: that.get('channelId'), text: encodeURIComponent(res)}, (res, err) => {
          if (err) {
            console.log('error editing message', err);
          }
        })
      }
    })
  }
  apiPrefixForChannel(channel){
    if(channel.is_im){
      return "im."
    }
    if(channel.is_group){
      return "groups.";
    }
    return "channels.";
  }
  handleMessage(msg){
    const { messages, unreadIndicator, users, channels, self } = this.data;
    const currChannel = this.data.channels[this.data.selectedChannelId];
    let channel;
    if(msg.type === 'message'){
      if(msg.channel){
        channel = channels[msg.channel];
        // Handle message change
        if(msg.subtype === 'message_changed' && msg.channel === currChannel.id){
          return this.saveData({messages: messages.map((obj) => {
            if(obj.ts === msg.message.ts){
              return Object.assign(obj, msg.message);
            }
            return obj;
          })})
        }
        else if(msg.subtype === 'message_deleted'){
          return this.saveData({messages: messages.filter((obj) => (obj.ts !== msg.deleted_ts))})
        }

        // If message is from someone else, and is not hidden
        if(msg.user !== self.id && !msg.hidden){

          Object.assign(channel, {'unread_count_display': channel.unread_count_display + 1 })
          this.saveData({channels: channels});

          // K_TODO: Test if msg.text exist, or generate it from attachment etc
          var text = msg.text;
          if(channel.is_im){
            this.swipes.sendEvent('notifications.send', {title: channel.name, message: text});
          }
        }

        // If message is in the current channel we should handle the unread handler
        if(msg && msg.channel === currChannel.id){

          // If the latest message is your own, channel should be unread
          if(msg.user === self.id){
            channel.last_read = msg.ts;
            this.saveData({unreadIndicator: null, channels})
          }
          else{

            if(document.hasFocus() && document.activeElement && document.activeElement.id  === 'chat-input'){
              this.markAsRead(msg.ts);
            }else{
              this.saveData({unreadIndicator: {ts: channel.last_read, showAsRead: false}});
            }
          }
          if(messages){
            this.saveData({messages: messages.concat([msg])});
          }
        }
      }
    }
    else if(msg.type === 'presence_change'){
      users[msg.user].presence = msg.presence;
      this.saveData({ users });
    }
    else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
      // If a user marks a channel as unread back in time. Make sure to update the unread line.
      channel = channels[msg.channel];
      if(msg.channel === currChannel.id){

        let newUnreadIndicator = {
          showAsRead: true,
        }
        if(unreadIndicator){
          newUnreadIndicator.ts = unreadIndicator.ts;
        }

        if(unreadIndicator && (msg.ts < unreadIndicator.ts)){
          newUnreadIndicator.showAsRead = false;
          newUnreadIndicator.ts = msg.ts;
        }
        this.saveData({unreadIndicator: newUnreadIndicator});

      }
      channel.unread_count_display = msg.unread_count_display;
      channel.last_read = msg.ts;
      this.saveData({channels})
    }

    if (msg.type === 'user_typing' && msg.channel === currChannel.id) {
      this.userTyping(msg);
    }

    // console.log('slack socket handler', msg.type, msg);
  }

  openImage(src, title, url) {
    this.swipes.modal('lightbox')('', title, url);

    this.swipes.service('slack').stream('file', {url: src})
    .then((arraybuffer) => {
      var blob = new Blob([arraybuffer], {type: "application/octet-stream"});
      var blobSrc = URL.createObjectURL(blob);

      this.swipes.modal('lightbox')(blobSrc, title, url);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  titleForChannel(channel){
    if(channel.name){
      return channel.name;
    }
    if(channel.user){
      return this.data.users[channel.user].name;
    }
  }
  getUserFromId(id){
    return this.data.users[id];
  }
  sendTypingEvent() {
    const { selectedChannelId } = this.data;

    this.socket.sendEvent({'id': '1', 'type': 'typing', 'channel': selectedChannelId});

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
    const users = Object.keys(this.typingUsers).map((userId) => this.getUserFromId(userId).name );

    let content = users.join(', ');

    if (users.length > 1) {
      content += ' are typing..';
    } else if (users.length === 1) {
      content += ' is typing..'
    } else{
      content = false;
    }
    this.saveData({'typingLabel': content});
  }

  loadPrivateImage(domElement, src) {
    this.swipes.service('slack').stream('file', {url: src})
    .then((arraybuffer) => {
      var blob = new Blob([arraybuffer], {type: "application/octet-stream"});
      var url = URL.createObjectURL(blob);
      domElement.src = url;
    })
    .catch((error) => {
      //console.log(error);
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
