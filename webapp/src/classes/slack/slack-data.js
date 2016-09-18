import { bindAll } from '../../classes/utils'

export default class SlackData {
  constructor(data){
    this.data = data || {};
    bindAll(this, ['handleMessage', 'notify'])
  }
  getData(){
    return JSON.parse(JSON.stringify(this.data));
  }
  notify(){
    if(typeof this.onChange === 'function'){
      this.onChange(this.data);
    }
  }
  updateBot(botId, data){
    this.data.bots[botId] = Object.assign({}, this.data.bots[botId], data);
    this.notify();
  }
  updateUser(userId, data){
    this.data.users[userId] = Object.assign({}, this.data.users[userId], data);
    if(userId === this.data.self.id){
      this.updateSelf(data);
    }
    this.notify();
  }
  updateSelf(data, dontNotify){
    Object.assign(this.data.self, data);
  }
  updateTeam(data){
    Object.assign(this.data.team, data);
    this.notify();
  }
  updateChannel(channelId, data){
    if(data){
      this.data.channels[channelId] = Object.assign({}, this.data.channels[channelId], data);
    }
    else{
      this.data.channels[channelId];
    }
    this.notify();
  }
  handleMessage(msg){

    console.log('socket message', msg);
    if('message' === msg.type){
      if(msg.channel){
        // If message is from someone else, and is not hidden
        
        if(msg.user !== self.id && !msg.hidden){
          var currentUnread = this.data.channels[msg.channel].unread_count_display;
          this.updateChannel(msg.channel, {'unread_count_display': currentUnread + 1 })
        }
      }
    }
    else if([ 
      'bot_added', 
      'bot_changed'].indexOf(msg.type) > -1)
    {
      this.updateBot(msg.bot.id, msg.bot);
    }
    else if([ 
      'channel_archive', 
      'channel_unarchive', 
      'group_archive', 
      'group_unarchive'].indexOf(msg.type) > -1)
    {
      var isArchiving = (['channel_archive', 'group_archive'].indexOf(msg.type) > -1);
      this.updateChannel(msg.channel, {'is_archived': isArchiving});
    }

    else if([ 
      'channel_created', 
      'im_created', 
      'channel_joined', 
      'channel_rename', 
      'group_joined', 
      'group_rename'].indexOf(msg.type) > -1)
    {
      this.updateChannel(msg.channel.id, msg.channel);
    }
    else if('channel_deleted' === msg.type){
      this.updateChannel(msg.channel, null);
    }
    else if('channel_left' === msg.type){
      this.updateChannel(msg.channel, {is_member: false});
    }
    else if([ 
      'channel_marked', 
      'group_marked', 
      'im_marked'].indexOf(msg.type) > -1)
    {
      this.updateChannel(msg.channel, {'unread_count_display': msg.unread_count_display, 'last_read': msg.ts})
    }
    else if([ 
      'group_close', 
      'im_close',
      'group_open', 
      'im_open'].indexOf(msg.type) > -1)
    {
      var isOpening = (['group_open', 'im_open'].indexOf(msg.type) > -1)
      this.updateChannel(msg.channel, {is_open: isOpening});
    }
    else if('presence_change' === msg.type){
      this.updateUser(msg.user, {presence: msg.presence});
    }
    else if([
      'star_added',
      'star_removed'].indexOf(msg.type) > -1){
      var isStarred = ('star_added' === msg.type);
      if(['channel', 'im', 'group'].indexOf(msg.item.type) > -1){
        this.updateChannel(msg.item.channel, {is_starred: isStarred});
      }
    }
    else if([
      'team_join', 
      'user_change'].indexOf(msg.type) > -1)
    {
      this.updateUser(msg.user.id, msg.user);
    }
  }
}
/*
    [x] bot_added
    [x] bot_changed
    [x] channel_archive
    [x] channel_created
    [x] channel_deleted
    [] channel_history_changed
    [x] channel_joined
    [x] channel_left
    [x] channel_marked
    [x] channel_rename
    [x] channel_unarchive
    [] dnd_updated
    [] dnd_updated_user
    [] email_domain_changed
    [] emoji_changed
    [] file_change
    [] file_comment_added
    [] file_comment_deleted
    [] file_comment_edited
    [] file_created
    [] file_deleted
    [] file_public
    [] file_shared
    [] file_unshared
    [x] group_archive
    [x] group_close
    [] group_history_changed
    [x] group_joined
    [] group_left
    [x] group_marked
    [x] group_open
    [x] group_rename
    [x] group_unarchive
    [x] im_close
    [x] im_created
    [] im_history_changed
    [x] im_marked
    [x] im_open
    [] manual_presence_change
    [] message
    [] pin_added
    [] pin_removed
    [] pref_change
    [] presence_change
    [] reaction_added
    [] reaction_removed
    [] reconnect_url
    [x] star_added
    [x] star_removed
    [] subteam_created
    [] subteam_self_added
    [] subteam_self_removed
    [] subteam_updated
    [] team_domain_change
    [x] team_join
    [] team_pref_change
    [] team_profile_change
    [] team_profile_reorder
    [] team_rename
    [x] user_change
    [] user_typing
*/
