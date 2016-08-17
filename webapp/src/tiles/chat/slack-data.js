import { bindAll, indexBy } from '../../classes/utils'
import { getTimeStr, dayStringForDate, startOfDayTs, isAmPm } from '../../classes/time-utils'
import SlackSocket from './slack-socket'

export default class SlackData {
  constructor(swipes, data){
    this.swipes = swipes;
    this.data = data;
    bindAll(this, ['start', 'handleMessage', 'getUserFromId', 'titleForChannel', 'sectionsForSidemenu', 'fetchMessages', 'setChannel', 'deleteMessage', 'editMessage', 'openImage', 'loadPrivateImage'])
    this.socket = new SlackSocket(this.start, this.handleMessage);
    this.start();
  }
  saveData(data, options){
    if(data.messages){
      data.sortedMessages = this.sortMessagesForSwipes(data.messages);
    }
    this.data = Object.assign(this.data, data);
    this.swipes.saveData(data, options);
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
        Object.keys(res.data).forEach((key) => {
          let generalChannelId;
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
          this.fetchMessages(this.data.channels[this.data.selectedChannelId]);
        }
        
      }
    })
  }
  setChannel(channel){
    if(typeof channel === 'string'){
      channel = this.data.channels[channel];
    }
    if(channel.id === this.data.selectedChannelId){
      return;
    }
    const data = {
      selectedChannelId: channel.id,
      messages: null
    };
    this.saveData(data);
    this.fetchMessages(channel);
  }
  fetchMessages(channel){
    this.swipes.service('slack').request(this.apiPrefixForChannel(channel) + "history", {channel: channel.id }).then((res) => {
      if(res.ok){
        this.saveData({messages: res.data.messages})
      }
    }).catch(function(error){
      console.log(error);
    });

  }
  sendMessage(message, callback){
    const { selectedChannelId } = this.data;
    this.swipes.service('slack').request('chat.postMessage', {text: encodeURIComponent(message), channel: selectedChannelId, as_user: true, link_names: 1}, (res, err) => {
      if(res.ok){
        this.swipes.sendEvent('analytics.action', {name: "Send message"});
        //this.onMarkAsRead(res.data.ts);
      }
      if(callback){
        callback();
      }
      
    });
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
        console.log(channel, msg.channel);
        // Handle message change
        if(msg.subtype === 'message_changed' && msg.message.channel === currChannel.id){
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
            this.saveData({unreadIndicator: null})
          }
          else{
            if(channel && !unreadIndicator){
              this.saveData({unreadIndicator: {ts: channel.last_read}});
            }
          }
          this.saveData({messages: messages.concat([msg])});
        }
      }
    }
    else if(msg.type === 'presence_change'){
      users[msg.user].presence = msg.presence;
      this.saveData({ users });
    }
    else if(msg.type === 'channel_marked' || msg.type === 'im_marked' || msg.type === 'group_marked'){
      // If a user marks a channel as unread back in time. Make sure to update the unread line.
      if(msg.channel === currChannel.id){
        
        let newUnreadIndicator = {
          showAsRead: true
        }
        if(unreadIndicator && ( !unreadIndicator.showAsRead || unreadIndicator.ts > msg.ts)){
          newUnreadIndicator.showAsRead = false;
          newUnreadIndicator.ts = msg.ts;
        }
        this.saveData({unreadIndicator: newUnreadIndicator});

      }
      currChannel.unread_count_display = msg.unread_count_display;
      currChannel.last_read = msg.ts;
      this.saveData({channels})
    }

    if (msg.type === 'user_typing' && msg.channel === currChannel.id) {
      //this.userTyping(msg);
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
  sectionsForSidemenu(){
    const { channels, selectedChannelId } = this.data;

    const starsCol = [];
    const channelsCol = [];
    const peopleCol = [];

    for( var key in channels ){
      const channel = channels[key];
      if(channel.is_archived ||
        (channel.is_im && !channel.is_open) ||
        (channel.is_channel && !channel.is_member) ||
        (channel.is_group && !channel.is_open)){
        continue;
      }

      const item = { id: channel.id, name: this.titleForChannel(channel) };
      if (selectedChannelId === channel.id) {
        item.active = true;
      } else if (channel.unread_count_display) {
        item.unread = channel.unread_count_display;
        if (channel.is_im) {
          item.notification = channel.unread_count_display;
        }
      }
      if (channel.is_starred) {
        starsCol.push(item);
      } else if (channel.is_im) {
        peopleCol.push(item);
      } else {
        channelsCol.push(item);
      }
    }

    const sections = []

    if(starsCol.length){
      sections.push({ title: "Starred", rows: starsCol.sort((a, b) => (a.name < b.name) ? -1 : 1) })
    }
    sections.push({ title: "Channels", rows: channelsCol.sort((a, b) => (a.name < b.name) ? -1 : 1) })
    sections.push({ title: "People", rows: peopleCol.sort((a, b) => (a.name < b.name) ? -1 : 1) })
    return sections;
  }
  sortMessagesForSwipes(messages){
    messages = messages || this.data.messages;
    if(!messages || !messages.length)
      return [];

    let lastUser, lastGroup, lastDate;
    const length = messages.length;
    const me = this.data.self;
    const groups = {};
    function pushToGroup(groupName, obj){
      if(!groups[groupName]){
        groups[groupName] = []
      }
      groups[groupName].push(obj)
    }
    messages.forEach((msg, i) => {
      const date = new Date(parseInt(msg.ts)*1000);
      const group = startOfDayTs(date);
      const { user:userId, bot_id, username } = msg;
      msg.timeStr = getTimeStr(date);
      msg.isExtraMessage = false;

      let user;
      if(userId){
        user = this.data.users[userId];
        if(user){
          msg.userObj = user;
          if(user.id == lastUser && group == lastGroup){
            msg.isExtraMessage = true;
          }
          if(user.id === me.id){
            msg.isMyMessage = true;
          }
        }

      }
      else if(bot_id){
        const bot = this.data.bots[bot_id];
        if(bot){
          msg.bot = bot;
        }
      }
      else{
        var bot = {};
        if(username){
          bot.name = username;
        }
        msg.bot = bot;
      }
      msg.isLastMessage = (i === length - 1);

      lastGroup = group;
      lastUser = user ? user.id : null;
      lastDate = date;
      pushToGroup(group, msg)
    });

    const sortedKeys = Object.keys(groups).sort();

    const sortedSections = sortedKeys.map((key) => {
      const schedule = new Date(parseInt(key)*1000);
      const title = dayStringForDate(schedule);

      return {"title": title, "messages": groups[key] };
    });

    return sortedSections;
  }
}

/*

var typingUsers = {};

var ChatStore = Reflux.createStore({
  listenables: [ChatActions],
  
  onSetChannel: function(channelId){
    var channel = ChannelStore.get(channelId);
    if(channel){
      this.unset(['messages', 'sections']);
      this.set('showingUnread', channel.last_read, {trigger:false});
      swipes.sendEvent('navigation.setTitle', {title:channel.name});
      this.set('channelId', channel.id);
      this.fetchChannel(channel);
    }

  },
  onMarkAsRead:function(ts){
    var channel = ChannelStore.get(this.get('channelId'));
    ts = ts || _.last(this.get('messages')).ts;
    if(!channel || ts === channel.last_read){
      return;
    }
    var prefix = this.apiPrefixForChannel(channel);
    swipes.service('slack').request(prefix + "mark",
      {
        channel: channel.id,
        ts: ts
    })
    .then(function(){
    })
  },

  onClickLink:function(url){
    swipes.sendEvent('openURL', {url: url});
  },
  
  userTyping: function (data) {
    var self = this;

    if (typingUsers[data.user]) {
      clearTimeout(typingUsers[data.user]);
    }

    var timeout = setTimeout(function() {
      delete typingUsers[data.user];
      self.userTypingLabel();
    }, 5000);

    typingUsers[data.user] = timeout;
    this.userTypingLabel();
  },
  userTypingLabel: function() {
    var userIds = Object.keys(typingUsers);
    var users = [];
    var content = '';

    userIds.forEach(function(userId) {
      users.push(UserStore.get(userId).name);
    });

    content = users.join(', ');

    if (users.length > 1) {
      content += ' are typing..';
      this.set('typing', content);
    } else if (users.length === 1) {
      content += ' is typing..'
      this.set('typing', content);
    } else {
      content = '';
      this.set('typing', false);
    }
  },
  onUploadFile: function(file, callback){
    var token = swipes.info.slackToken;
    var formData = new FormData();
    formData.append("token", token);
    formData.append("channels", this.get('channelId'));
    formData.append("filename", file.name);
    formData.append("title", file.name);
    formData.append("file", file);
    this.__tempSlackUpload(formData, function(result, error){
      callback(result, error);
    }.bind(this));
  },
  
  
  
  /* T_INFO // We should replace these once we can upload directly through our service
  // Though, the request might come in handy for how to send the request since they use formData for files.
  

  __tempSlackUpload:function(formData, callback){
    $.ajax({
      url : 'https://slack.com/api/files.upload',
      type: "POST",
      success: function(res){
        console.log('res slack upload', res);
        callback(true);
      },
      error: function(err){
        console.log('err slack upload', err);
        callback(false, err);
      },
      crossDomain: true,
      data: formData,
      processData: false,
      contentType: false
    });
  },
  onSendTypingEvent: function() {
    var currentChannel = ChannelStore.get(this.get('channelId'));

    
    this.webSocket.send(JSON.stringify({'id': '1', 'type': 'typing', 'channel': currentChannel.id}));

  }
});

module.exports = ChatStore;
*/