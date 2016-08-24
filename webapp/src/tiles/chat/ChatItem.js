import React, { Component, PropTypes } from 'react'

import ReactEmoji from 'react-emoji'
import SwipesCard from '../../components/swipes-card/SwipesCard'
import { bindAll, dataIdFromShareURL } from '../../classes/utils'

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
    if(Array.isArray(text)){
      text = text.map((t, i) => {
        if(typeof t === 'object'){
          if(t.type === 'card'){
            const dataId = dataIdFromShareURL(t.data);
            return <SwipesCard key={'card' + i} dataId={dataId} shortUrlProvider={shortUrlProvider}/>
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
          return ReactEmoji.emojify(t);
        }
        else{
          return t;
        }
      })
    }
    else if(emojis){
      return ReactEmoji.emojify(text);
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
        title: this.renderTextWithLinks(title),
        subtitle: this.renderTextWithLinks(subtitle),
        description: this.renderTextWithLinks(description, true),
        ...other
      }
      return <SwipesCard key={'card-'+i} data={data}/>
    })
  }
  renderMessage(){
    const { ts, timeStr, oldText } = this.props.data;
    let { text } = this.props.data;
    text = this.renderTextWithLinks(text, true);

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
  clickedLink: PropTypes.func,
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
