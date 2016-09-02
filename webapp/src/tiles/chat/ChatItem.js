import React, { Component, PropTypes } from 'react'

import ReactEmoji from 'react-emoji'
import SwipesCard from '../../components/swipes-card/SwipesCard'
import { bindAll, shortUrlFromShareUrl } from '../../classes/utils'

let delegate;
const delegateMethods = [ 'clickLink' ]

class ChatItem extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['clickedLink'])
  }
  renderMessageHeader(){
    const { name, timeStr, profileImage, dontRenderProfile } = this.props.data;
    if(dontRenderProfile){
      return;
    }

    return (
      <div className="chat__message__info">
        <div className="chat__message__info--profile-img">
          <img src={profileImage} />
        </div>
        <div className="chat__message__info--author">{name}</div>
        <div className="chat__message__info--timestamp">{this.renderTextWithLinks(timeStr)}</div>
      </div>
    );
  }
  clickedLink(match, e) {
    const res = match.split("|");
    const { clickedLink } = this.props;
    if(clickedLink){
      clickedLink(...res);
    }
    console.log('clicked', ...res);
    e.stopPropagation()

  }
  renderTextWithLinks(text, emojis){
    const emojiOptions = {
      attributes: {
        width: '17px',
        height: '17px',
        className: 'emoji'
      }
    }
    if(Array.isArray(text)){
      text = text.map((t, i) => {
        if(typeof t === 'object'){
          if(t.type === 'card'){
            const shortUrl = shortUrlFromShareUrl(t.data);
            return <SwipesCard key={'card' + i} data={{ shortUrl }} delegate={this.props.cardDelegate} />
          }
          if(t.type === 'link'){
            return <a key={'link' + i} className='link' onClick={this.clickedLink.bind(null, t.data)}>{unescape(t.title)}</a>;
          }
          if(t.type === 'linebreak'){
            return <br key={'break' + i} />
          }
          console.log('object!', t);
        }
        else if(emojis){
          return ReactEmoji.emojify(t, emojiOptions);
        }
        else{
          return t;
        }
      })
    }
    else if(emojis){
      return ReactEmoji.emojify(text, emojiOptions);
    }
    return text;
  }
  renderCards(){
    const { cards } = this.props.data;
    if(!cards){
      return;
    }
    return cards.map((card, i) => {
      return <SwipesCard key={'card-'+i} data={card} delegate={this.props.cardDelegate}/>
    })
  }
  renderMessage(){
    const { ts, timeStr, oldText } = this.props.data;
    let { text } = this.props.data;
    text = this.renderTextWithLinks(text, true);

    return (
      <div id={ts} className="message-wrapper">
        <div className="chat__message--content">
          <div className="chat__message--content--text" data-timestamp={timeStr}>
            {text}
          </div>
          {this.renderCards()}
        </div>
      </div>
    );
  }
  render() {
    const { dontRenderProfile } = this.props.data;
    let className = 'chat__message';

    if (dontRenderProfile) {
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

ChatItem.propTypes = {
  clickedLink: PropTypes.func,
  cardDelegate: PropTypes.object.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    timeStr: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    profileImage: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.object) // SwipesCard PropTypes
  })
}
