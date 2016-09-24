import React, { Component, PropTypes } from 'react';
import { randomString, bindAll, decodeHtml } from '../../classes/utils';
import SwipesDot from '../swipes-dot/SwipesDot';
import { DownloadIcon } from '../icons'

class SwipesCardItem extends Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data }
    bindAll(this, ['onClick', 'updateData', 'onAction', 'onDragStart', 'clickedLink'])
    this.id = randomString(5);
  }
  updateData(data){
    const newData = Object.assign({}, this.state.data, data);
    this.setState({ data:newData });
  }
  componentDidMount(){
    const { data } = this.props;
    if(data.shortUrl){
      window.swipesUrlProvider.subscribe(data.shortUrl, this.updateData, this.id);
    }
  }
  componentDidUpdate(prevProps){
    if(JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)){
      const newData = Object.assign(this.state.data, this.props.data);
      this.setState({ data: newData });
    }
  }
  componentWillUnmount(){
    const { data, callDelegate } = this.props;
    if(data.shortUrl){
      window.swipesUrlProvider.unsubscribe(data.shortUrl, this.updateData, this.id);
    }
  }
  onClick(e){
    const { data, callDelegate } = this.props;
    if(!window.getSelection().toString().length){
      callDelegate('onCardClick', data);
    }
  }
  onAction(action){
    const { data, callDelegate } = this.props;
    if(action.label === 'Share'){
      callDelegate('onCardShare', data);
    }
    else {
      callDelegate('onCardAction', data, action);
    }
  }
  onDragStart(){
    const { data, callDelegate } = this.props;
    callDelegate('onCardShare', data, true);
  }
  renderDot(actions){
    const { onDragStart } = this.props;

    if (this.state.data.dot === false) {
      return;
    }

    return (
      <div className="dot-wrapper">
        <SwipesDot
          onDragStart={this.onDragStart}
          hoverParentId={"swipes-card__item-" + this.id }
          elements={[actions]}
        />
      </div>
    )
  }
  renderHeaderImage(headerImage){
    const {
      preview
    } = this.state.data;

    if (headerImage) {
      return (
        <img src={headerImage} alt="" />
      )
    } else if (preview && preview.url) {
      return (
        <a href={preview.url} download={preview.url} className="swipes-card__header__download">
          <DownloadIcon />
        </a>
      )
    }
  }
  renderHeader(actions, title, subtitle, headerImage, url) {
    const noSubtitleClass = !subtitle ? "swipes-card__header__content--no-subtitle" : '';

    return (
      <div className="swipes-card__header">
        <div className="swipes-card__header__dot">
          {this.renderDot(actions)}
        </div>
        <div className={"swipes-card__header__content " + noSubtitleClass}>
          <div className="swipes-card__header__content--title">{this.renderTextWithLinks(title)}</div>
          <div className="swipes-card__header__content--subtitle">{this.renderTextWithLinks(subtitle)}</div>
        </div>
        <div className="swipes-card__header__image">
          {this.renderHeaderImage(headerImage)}
        </div>
      </div>
    )
  }
  renderDescription(description) {
    if(!description){
      return;
    }
    return (
      <div className="description-container">
        <div className="swipes-card__description">
          {this.renderTextWithLinks(description)}
        </div>
      </div>
    )
  }
  isVideo(url) {
    if(!url){
      return false;
    }
    return (url.match(/\.(mov|mp4)$/) != null);
  }
  isImage(url) {
    if(!url){
      return false;
    }
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }
  renderPreview(preview) {
    if(!preview){
      return;
    }

    const isImage = this.isImage(preview.url);
    const isVideo = this.isVideo(preview.url);

    if (isVideo) {
      return (
        <div className="swipes-card__preview swipes-card__preview--no-style">
          <div className="swipes-card__preview--video">
            <video className="custom-html" src={preview.url} controls></video>
          </div>
        </div>
      )
    }

    if (preview.type === 'image' && isImage) {
      const { cardPreview } = this.refs;


      if (cardPreview) {
        if (preview.width > cardPreview.clientWidth) {
          preview.height = preview.height * cardPreview.clientWidth / preview.width;
          preview.width = cardPreview.clientWidth;
        }
      }
      return (
        <div className="swipes-card__preview" ref="cardPreview">
          <div className="swipes-card__preview--img">
            <img src={preview.url} height={preview.height} width={preview.width} alt=""/>
          </div>
        </div>
      )
    }

    if (preview.type === 'html') {
      return (
        <div className="swipes-card__preview swipes-card__preview--no-style">
          <div className="swipes-card__preview--iframe">
            <div className="custom-html" dangerouslySetInnerHTML={{__html: preview.html}}></div>
          </div>
        </div>
      )
    }
  }
  render() {
    const {
      title,
      subtitle,
      description,
      headerImage,
      actions,
      preview,
      dot
    } = this.state.data;

    return (
      <div id={"swipes-card__item-" + this.id } className="swipes-card__item" onClick={this.onClick}>
        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}
        {this.renderPreview(preview)}
      </div>
    )
  }
  renderTextWithLinks(text){
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

        // Else add the link with the proper title
        const res = innerMatch.split("|");
        const command = res[0];
        let title = res[res.length -1];

        replaced.push(<a key={'link' + i} className='link' onClick={this.clickedLink.bind(null, innerMatch)}>{decodeHtml(title)}</a>);

        // Adding the after text between the matches
        replaced.push(decodeHtml(splits.shift()));
      }
      if(replaced.length)
        return replaced;
    }
    return decodeHtml(text);
  }
  clickedLink(match, e) {
    const res = match.split("|");
    console.log('clicked', res);
    this.props.callDelegate('onCardClickLink', res);
    e.stopPropagation()

  }
}

export default SwipesCardItem

const { string, number, shape, oneOf, oneOfType, arrayOf, func } = PropTypes;


SwipesCardItem.propTypes = {
  callDelegate: func.isRequired,
  data: shape({
    id: oneOfType([string, number]),,
    shortUrl: string,
    title: string,
    subtitle: string,
    description: string,
    headerImage: string,
    preview: shape({
      type: oneOf(['html', 'image']).isRequired,
      url: string,
      html: string,
      width: oneOfType([string, number]),
      height: oneOfType([string, number])
    }),
    actions: arrayOf(shape({
      label: string.isRequired,
      icon: string,
      bgColor: string
    }))
  })
}
