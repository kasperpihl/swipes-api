import React from 'react'
import ReactEmoji from 'react-emoji'

import { bindAll, indexBy } from '../../classes/utils'
import { getTimeStr, dayStringForDate, startOfDayTs, isAmPm } from '../../classes/time-utils'
import { isShareURL } from '../../classes/utils'

const DEFAULT_PROFILE = 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-48.png?ssl=1';

export default class SlackSwipesParser {
  titleForChannel(channel, users){
    if(channel.name){
      return channel.name;
    }
    if(channel.user){
      return users[channel.user].name;
    }
  }
  sectionsForSidemenu(data){
    const { channels, users, selectedChannelId } = data;
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

      const item = { id: channel.id, name: this.titleForChannel(channel, users) };
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
  parseAttachmentToCard(attachment){

  }
  parseFileToCard(file){

  }
  parseMessageFromSlack(msg, data){
    const { bots, self, users } = data;
    const date = new Date(parseInt(msg.ts)*1000);
    const group = startOfDayTs(date);
    const newMsg = { 
      ts: msg.ts, 
      timeStr: getTimeStr(date), 
      name: 'unknown',
      profileImage: DEFAULT_PROFILE
    };
    
    if(msg.text && msg.text.length){
      newMsg.oldText = msg.text;
      newMsg.text = this.renderTextWithLinks(this.replaceNewLines(msg.text), ReactEmoji.emojify, data.users);
    }
    
    const { user:userId, bot_id, username } = msg;
    
    let user;

    if(userId){
      user = users[userId];
      if(user){
        if(user.name){
          newMsg.name = user.name;
        }
        if(user.profile){
          newMsg.profileImage = user.profile.image_48;
        }
        if(user.id == this.lastUser && group == this.lastGroup){
          newMsg.dontRenderProfile = true;
        }
        if(user.id === self.id){
          newMsg.isMyMessage = true;
        }
      }
    }
    else if(bot_id){
      const bot = bots[bot_id];
      if(bot){
        if(bot.name){
          newMsg.name = bot.name;
        }
        if(bot.icons && bot.icons.image_48){
          newMsg.profileImage = bot.icons.image_48;
        }
      }
    }
    else{
      if(username){
        newMsg.name = username;
      }
    }
    this.lastUser = user ? user.id : null;
    this.lastGroup = group;
    return { group , newMsg: newMsg};
  }
  sortMessagesForSwipes(data){
    const { messages, bots, self, users } = data;
    if(!messages || !messages.length)
      return [];

    const length = messages.length;

    const groups = {};
    function pushToGroup(groupName, obj){
      if(!groups[groupName]){
        groups[groupName] = []
      }
      groups[groupName].push(obj)
    }
    messages.forEach((msg, i) => {
      const { newMsg, group } = this.parseMessageFromSlack(msg, data);
      newMsg.isLastMessage = (i === length - 1);
      pushToGroup(group, newMsg);
    });

    const sortedKeys = Object.keys(groups).sort();

    const sortedSections = sortedKeys.map((key) => {
      const schedule = new Date(parseInt(key)*1000);
      const title = dayStringForDate(schedule);
      const sortedMessages = groups[key].sort((a, b) => { if(a.ts < b.ts) return -1; return 1})
      return {"title": title, "messages": sortedMessages };
    });

    return sortedSections;
  }
  clickedLink(match, e) {
    const res = match.split("|");
    let clickObj = {};
    if(res[0])
      clickObj.command = res[0];
    if(res[1])
      clickObj.identifier = res[1];
    if(res[2])
      clickObj.title = res[2];
    console.log('clicked', clickObj, e);
    e.stopPropagation()
    this.delegate.clickLink(clickObj.command);
  }
  replaceNewLines(text){
    if(!text || !text.length)
      return text;
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  renderTextWithLinks(text, emojiFunction, users){
    if(!text || !text.length)
      return text;
    if(typeof emojiFunction !== 'function'){
      emojiFunction = (par) => par;
    }

    const matches = text.match(/<(.*?)>/g);

    const replaced = [];

    if ((matches != null) && matches.length) {
      const splits = text.split(/<(.*?)>/g);
      let counter = 0;

      // Adding the text before the first match
      replaced.push(emojiFunction(splits.shift()));
      for(var i = 0 ; i < matches.length ; i++ ){
        // The match is now the next object
        const innerMatch = splits.shift();
        let placement = '';

        // If break, just add that as the placement
        if(innerMatch === 'br'){
          var key = 'break' + (counter++);
          placement = <br key={key}/>;
        }
        // Else add the link with the proper title
        else{
          const res = innerMatch.split("|");
          const command = res[0];
          let title = res[res.length -1];
          if(isShareURL(title)){
            console.log('was a share url!!! YIR', title);
          }
          else if(title.startsWith("@U")){
            const user = users[title.substr(1)];
            if(user){
              title = "@" + user.name;
            }
          }

          var key = 'link' + (counter++);
          placement = <a key={key} className='link' onClick={this.clickedLink.bind(null, innerMatch)}>{unescape(title)}</a>;
        }

        // Adding the replacements
        replaced.push(placement);

        // Adding the after text between the matches
        replaced.push(emojiFunction(unescape(splits.shift())));
      }
      if(replaced.length)
        return replaced;
    }
    return emojiFunction(unescape(text));
  }
}



const removeLinksFromText = (text) => {
  if(!text || !text.length)
    return text;
  return text.replace(/<(.*?)>/g, '');
}

