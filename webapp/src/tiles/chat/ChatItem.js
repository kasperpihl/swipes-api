import React, { Component, PropTypes } from 'react'
import createFragment from 'react-addons-create-fragment'

import ReactEmoji from 'react-emoji'
import SwipesCard from '../../components/swipes-card/SwipesCard'

let delegate;
const delegateMethods = [ 'clickLink' ]

class ChatItem extends Component {
  constructor(props) {
    super(props)
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
        <div className="chat__message__info--timestamp">{timeStr}</div>
      </div>
    );
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
    //this.delegate.clickLink(clickObj.command);
  }
  renderTextWithLinks(text, emojis){
    if(Array.isArray(text)){
      text = text.map((t, i) => {
        if(typeof t === 'object'){
          if(t.type === 'link'){
            return <a key={'link' + i} className='link' onClick={this.clickedLink.bind(null, t.data)}>{unescape(t.title)}</a>;
          }
          if(t.type === 'linebreak'){
            return <br key={'break' + i} />
          }
          console.log('object!', t);
        }
        else if(emojis){
          return ReactEmoji.emojify(t);
        }
        else{
          return t;
        }
      })
    }
    return text;
  }
  renderCards(){
    const { cards } = this.props.data;
    if(!cards){
      return;
    }
    return cards.map((card, i) => {
      const {
        title,
        subtitle,
        description,
        ...other
      } = card;
      const data = {
        title: this.renderTextWithLinks(title, true),
        subtitle: this.renderTextWithLinks(subtitle, true),
        description: this.renderTextWithLinks(description, true),
        ...other
      }
      return <SwipesCard key={'card-'+i} data={data}/>
    })
  }
  renderMessage(){
    const { ts, timeStr, oldText } = this.props.data;
    let { text } = this.props.data;
    text = this.renderTextWithLinks(text);
    return (
      <div id={ts} className="message-wrapper">
        <div className="chat__message--content" data-timestamp={timeStr}>
          <div className="chat__message--content--text">
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
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    timeStr: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    profileImage: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.object) // SwipesCard PropTypes
  })
}