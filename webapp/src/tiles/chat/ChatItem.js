import React, { Component, PropTypes } from 'react'
import SwipesDot from '../../components/swipes-dot/SwipesDot'
import ReactEmoji from 'react-emoji'

import SwipesCard from '../../components/swipes-card/SwipesCard'

let delegate;
const delegateMethods = ['editMessage', 'deleteMessage', 'isShareURL', 'openImage', 'loadPrivateImage', 'clickLink']

class ChatItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    delegate = props.delegate;
    if(!delegate){
      throw 'ChatItem: must have delegate prop'
    }
    if(typeof delegate !== 'object'){
      throw 'ChatItem: delegate must be object'
    }
    delegateMethods.forEach((method) => {
      if(typeof delegate[method] !== 'function'){
        throw 'ChatItem: delegate must conform to: ' + method;
      }
    })

  }
  renderMessageHeader(){
    let name = 'unknown';
    const { data:message } = this.props;
    if(message.isExtraMessage){
      return;
    }

    if(message.userObj){
      name = message.userObj.name;
    }
    else if(message.bot){
      name = message.bot.name;
    }
    return (
      <div className="chat__message__info">
        <div className="chat__message__info--profile-img">
          {this.renderProfileImage()}
        </div>
        <div className="chat__message__info--author">{name}</div>
        <div className="chat__message__info--timestamp">{message.timeStr}</div>
      </div>
    );
  }
  renderProfileImage(){
    const { data:message } = this.props;
    if(message.isExtraMessage){
      return;
    }

    let profile_image = 'https://i0.wp.com/slack-assets2.s3-us-west-2.amazonaws.com/8390/img/avatars/ava_0002-48.png?ssl=1';
    if(message.userObj && message.userObj.profile){
      profile_image = message.userObj.profile.image_48;
    }
    else if(message.bot && message.bot.icons){
      if(message.bot.icons.image_48){
        profile_image = message.bot.icons.image_48;
      }
    }
    return (
      <img src={profile_image} />
    );
  }
  renderMessage(){
    const { data:message } = this.props;
    return <ChatMessage key={message.ts} data={message} />;
  }
  render() {
    const { isExtraMessage } = this.props.data;
    let className = 'chat__message';

    if (this.props.data.isExtraMessage) {
      className += ' extra-message';
    }

    return (
      <div className={className}>
        {this.renderMessageHeader()}
        {this.renderMessage()}
      </div>
    )
  }
}
export default ChatItem

class ChatMessage extends Component {
  share(text) {
    console.log('share', text);
    //delegate.share('share', this.shareData(text));
  }
  shareData(text) {
    return {
      text: text
    }
  }
  renderAttachments(){
    const { attachments } = this.props.data;
    if(!attachments){
      return;
    }
    return attachments.map(function(att){
      return <Attachment key={att.id} data={att} />
    });
  }
  renderFile(){
    const { file } = this.props.data;
    if(!file){
      return;
    }
    return <File key={file.id} data={file} />
  }
  renderMessage(message){
    return renderTextWithLinks(message, ReactEmoji.emojify);
  }
  dotItems() {
    const items = [];
    const actionsRow = [];

    const { data:message } = this.props;

    const shareItem = {
      label: 'Share',
      icon: 'share',
      bgColor: 'rgb(255,197,37)',
      callback: () => {
        this.share(message.text);
      }
    };

    if (message.userObj && message.userObj.me && message.subtype != 'group_join') {
      actionsRow.push({
        label: 'Edit',
        icon: 'edit',
        bgColor: 'rgb(56,182,131)',
        callback: () => delegate.editMessage(message.text, message.ts)
      });

      actionsRow.push(shareItem);

      actionsRow.push({
        label: 'Delete',
        icon: 'delete',
        bgColor: 'rgb(252,58,28)',
        callback: () => delegate.deleteMessage(message.ts)
      })
      items.push(actionsRow);
    } else {
      actionsRow.push(shareItem);
      items.push(actionsRow);
    }

    return items;
  }
  onDotDragStart(message){
    console.log('dot start', message);
    //swipes.sendEvent('dot.startDrag', this.shareData(message));
  }
  render() {

    const { data:message } = this.props;
    let className = "message-wrapper";
    if(message.isNewMessage){
      className += " new-message";
    }
    const dotItems = this.dotItems();

    return (
      <div id={message.ts} className={className}>
        <div className="chat__message--content" data-timestamp={message.timeStr}>
          {/*<SwipesDot
            className="dot"
            radial={false}
            reverse={true}
            showOnHover={true}
            hoverParentId={message.ts}
            elements={dotItems}
            onDragStart={this.onDotDragStart.bind(this, message.text)}
            onDragData={this.shareData.bind(this, message.text)}
          />*/}
          <div className="chat__message--content--text">
            {this.renderMessage(message.text)}
          </div>
          {this.renderFile()}
          {this.renderAttachments()}
        </div>
      </div>
    );
  }
}

class File extends Component {
  openImage() {
    const {
      'url_private_download':src,
      thumb_360_w,
      thumb_360_h,
      title,
      permalink:url
    } = this.props.data;

    delegate.openImage(src, title, url);
  }
  render(){
    let { name, url_private, thumb_360_w, thumb_360_h } = this.props.data;
    return (
      <SwipesCard data={{title: name || '', preview: {type: 'image', url: url_private, width: thumb_360_w , height: thumb_360_h}}}/>
    );
  }
}

File.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    permalink: PropTypes.string,
    'url_private_download': PropTypes.string,
    'thumb_360': PropTypes.string,
    'thumb_360_w': PropTypes.number,
    'thumb_360_h': PropTypes.number,
  })
}

class Attachment extends Component {
  generateTitleAndDescription(){
    let newTitle, newDescription;
    const {
      title,
      text,
      pretext,
      fallback
    } = this.props.data;

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
    newTitle = renderTextWithLinks(newTitle, null, true);
    if(Array.isArray(newTitle)){
      newTitle = newTitle.join(' ')
    }

    newDescription = renderTextWithLinks(newDescription, null, true);
    if(Array.isArray(newDescription)){
      newDescription = newDescription.join(' ')
    }

    return {
      title: newTitle,
      description: newDescription
    }
  }
  generatePreview(){
    const {
      image_url,
      image_height,
      image_width,
      video_html,
      audio_html
    } = this.props.data;
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
        html: video_html.replace('autoplay=1', 'autoplay=0')
      }
    }
    if(audio_html){
      preview = {
        type: 'html',
        html: audio_html
      }
    }
    return preview;
  }
  render(){
    const {
      service_name
    } = this.props.data;

    const preview = this.generatePreview();
    const { title, description } = this.generateTitleAndDescription();

    return (
      <SwipesCard data={{ title, subtitle: service_name, description, preview }}/>
    );
  }
}

Attachment.propTypes = {
  data: PropTypes.shape({
    pretext: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    'service_name': PropTypes.string,
    title: PropTypes.string,
    'title_link': PropTypes.string,
    image_url: PropTypes.string,
    image_height: PropTypes.number,
    image_width: PropTypes.number
  })
}


const clickedLink = (match, e) => {
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
  delegate.clickLink(clickObj.command);

}


const removeLinksFromText = (text) => {
  if(!text || !text.length)
    return text;
  return text.replace(/<(.*?)>/g, '');
}

const renderTextWithLinks = (text, emojiFunction, dontReplaceLineBreaks) =>{
  if(!text || !text.length)
    return text;
  if(typeof emojiFunction !== 'function'){
    emojiFunction = (par) => par;
  }
  if(!dontReplaceLineBreaks){
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
        if(delegate.isShareURL(title)){
          console.log('was a share url!!! YIR', title);
        }
        else if(title.startsWith("@U")){
          const user = delegate.getUserFromId(title.substr(1));
          if(user){
            title = "@" + user.name;
          }
        }

        var key = 'link' + (counter++);
        placement = <a key={key} className='link' onClick={clickedLink.bind(null, innerMatch)}>{unescape(title)}</a>;
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
