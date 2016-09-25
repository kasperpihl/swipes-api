import { bindAll, indexBy, decodeHtml } from '../../classes/utils'
import { getTimeStr, dayStringForDate, startOfDayTs, isAmPm } from '../../classes/time-utils'
import { SlackOnline, SlackOffline } from '../../components/icons';

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
  iconForChannel(channel, users){
    if(channel.user){
      var user = users[channel.user];
      if (user.presence === "active") {
        return (
          {
            svg: SlackOnline,
            width: 8,
            height: 8
           }
        )
      } else {
        return (
          {
            svg: SlackOffline,
            width: 8,
            height: 8
          }
        )
      }
    }
    return null;
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

      const item = { id: channel.id, name: this.titleForChannel(channel, users), icon: this.iconForChannel(channel, users) };
      if (selectedChannelId === channel.id) {
        item.active = true;
      }



      if (channel.unread_count_display) {
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
      var counter = 0;
      sections.push({
        title: "Starred",
        rows: starsCol.sort((a, b) => {
          if(a.id.startsWith('D') !== b.id.startsWith('D')){
            return (a.id.startsWith('D')) ? 1 : -1;
          }
          return (a.name < b.name) ? -1 : 1;
        })
      })
    }
    sections.push({ title: "Channels", rows: channelsCol.sort((a, b) => (a.name < b.name) ? -1 : 1) })
    sections.push({ title: "People", rows: peopleCol.sort((a, b) => (a.name < b.name) ? -1 : 1) })
    return sections;
  }
  parseAttachmentToCards(msg, data){
    return msg.attachments.map((attachment) => {
      const {
        title,
        text,
        pretext,
        fallback,
        service_name,
        image_url,
        image_height,
        image_width,
        video_html,
        audio_html
      } = attachment;
      let newTitle, newDescription;
      const texts = [ title, pretext, text ];
      texts.forEach((t, i) => {
        if(!newTitle && t){
          newTitle = t;
        }
        else if(!newDescription && t){
          newDescription = t;
        }
      })

      if(!newTitle){
        newTitle = fallback;
      }

      let preview;
      if (image_url) {
        preview = {
          type: 'image',
          url: image_url,
          width: image_width,
          height: image_height
        }
      }

      if (video_html) {
        preview = {
          type: 'html',
          html: video_html.replace('autoplay=1', 'autoplay=0').replace('autoplay ', '')
        }
      }
      if(audio_html){
        preview = {
          type: 'html',
          html: audio_html
        }
      }
      return {
        id: data.selectedChannelId + '-' + msg.ts + '-' + attachment.id,
        type: 'attachment',
        title: newTitle,
        description: newDescription,
        preview,
        subtitle: service_name
      };
    })
  }
  parseFileToCard(msg, data){
    let { name, thumb_360, thumb_360_w, thumb_360_h, id, filetype, url_private_download } = msg.file;
    const card = {
      id,
      type: 'file',
      title: name || ''
    }
    if(thumb_360){
      card.type = 'image',
      card.preview = {type: 'image', url: thumb_360, width: thumb_360_w , height: thumb_360_h}
    }

    if ((filetype === 'mov' | 'mp4') && url_private_download) {
      card.type = 'html',
      card.preview = {type: 'html', url: url_private_download, width: '360', height:'180'}
    }
    return [card];
  }
  parseMessageFromSlack(msg, data){
    const { bots, self, users } = data;
    const date = new Date(parseInt(msg.ts)*1000);
    const group = startOfDayTs(date);
    const newMsg = {
      ts: msg.ts,
      key: msg.ts,
      timeStr: getTimeStr(date),
      name: 'unknown',
      profileImage: DEFAULT_PROFILE
    };

    if(msg.text && msg.text.length){
      newMsg.oldText = msg.text;
      newMsg.text = this.renderTextWithLinks(this.replaceNewLines(msg.text), data.users);
    }

    const { user:userId, bot_id, username } = msg;

    let user, cards;

    if(userId){
      user = users[userId];
      if(user){
        if(user.name){
          newMsg.name = user.name;
        }
        if(user.profile){
          newMsg.profileImage = user.profile.image_48;
        }

        if(user.id === this.lastUser && group === this.lastGroup){
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

    if(msg.file){
      cards = this.parseFileToCard(msg, data);
    }
    else if(msg.attachments){
      cards = this.parseAttachmentToCards(msg, data);
    }

    if(cards){
      newMsg.cards = cards;
    }
    this.lastUser = user ? user.id : null;
    this.lastGroup = group;
    return { group , newMsg: newMsg};
  }
  sortMessagesForSwipes(data){
    const { bots, self, users, unsentMessageQueue, isSendingMessage, selectedChannelId, unreadIndicator } = data;
    if(!data.cachedChannels || !data.cachedChannels[selectedChannelId]){
      return;
    }
    const messages = data.cachedChannels[selectedChannelId].messages;
    if(!messages || !messages.length)
      return [];
    const sortedMessages = messages.sort((a, b) => (a.ts < b.ts) ? -1 : 1)
    const groups = {};
    function pushToGroup(groupName, obj){
      if(!groups[groupName]){
        groups[groupName] = []
      }
      groups[groupName].push(obj)
    }


    let lastMessageWasLastRead = false
    sortedMessages.forEach((msg, i) => {
      const { newMsg, group } = this.parseMessageFromSlack(msg, data);

      if(lastMessageWasLastRead){
        newMsg.isFirstUnreadMessage = true;
        lastMessageWasLastRead = false;
      }

      if(unreadIndicator && unreadIndicator.ts === newMsg.ts){       lastMessageWasLastRead = true;
      }
      pushToGroup(group, newMsg);
    });


    const sortedKeys = Object.keys(groups).sort();

    const sortedSections = sortedKeys.map((key, i) => {
      const schedule = new Date(parseInt(key)*1000);
      const title = dayStringForDate(schedule);
      const sectMessages = groups[key];
      return {"title": title, "messages": sectMessages };
    });
    const sendingMessagesQueue = data.sendingMessagesQueue || [];
    const sendingMessages = sendingMessagesQueue.map((item, i) => {
      const newMsg = {
        timeStr: item.status,
        name: self.name,
        key: 'unsent-' + i,
        profileImage: DEFAULT_PROFILE
      }
      if(users[self.id].profile){
        newMsg.profileImage = users[self.id].profile.image_48;
      }
      if(i > 0){
        newMsg.dontRenderProfile = true;
      }

      if(item.type === 'file'){
        newMsg.cards = [{ title: item.message, subtitle: item.status }]
        if(item.status == 'Failed'){
          // Do something when file fails....
        }
      }
      else if(item.type === 'message'){
        newMsg.text = item.message;
        if(item.status == 'Failed'){
          newMsg.text = [item.message, ' ', { type: 'link', title: 'Retry', data: 'swipes://retry-send' }];
        }
      }
      return newMsg;
    })

    const lastSection = sortedSections[sortedSections.length - 1]
    if(sendingMessages.length){
      lastSection.messages = lastSection.messages.concat(sendingMessages);
    }

    return sortedSections;
  }
  replaceNewLines(text){
    if(!text || !text.length)
      return text;
    return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  renderTextWithLinks(text, users){
    if(!text || !text.length)
      return text;

    const matches = text.match(/<(.*?)>/g);

    const replaced = [];

    if ((matches != null) && matches.length) {
      const splits = text.split(/<(.*?)>/g);

      // Adding the text before the first match
      replaced.push(splits.shift());
      for(var i = 0 ; i < matches.length ; i++ ){
        // The match is now the next object
        const innerMatch = splits.shift();
        let placement = '';

        // If break, just add that as the placement
        if(innerMatch === 'br'){
          placement = { type: 'linebreak' };
        }
        // Else add the link with the proper title
        else{
          const res = innerMatch.split("|");
          const command = res[0];
          let title = res[res.length -1];
          if(title.startsWith("@U")){
            const user = users[title.substr(1)];
            if(user){
              title = "@" + user.name;
            }
          }

          placement = { type: 'link', title: decodeHtml(title), data: innerMatch };
          if(isShareURL(command)){
            placement = { type: 'card', data: command };
          }
        }

        // Adding the replacements
        replaced.push(placement);

        // Adding the after text between the matches
        replaced.push(decodeHtml(splits.shift()));
      }
      if(replaced.length)
        return replaced;
    }
    return decodeHtml(text);
  }
}



const removeLinksFromText = (text) => {
  if(!text || !text.length)
    return text;
  return text.replace(/<(.*?)>/g, '');
}
