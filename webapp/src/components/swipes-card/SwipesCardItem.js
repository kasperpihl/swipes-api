import React, { Component, PropTypes } from 'react';
import { randomString, bindAll } from '../../classes/utils';
import SwipesDot from '../swipes-dot/SwipesDot';

class SwipesCardItem extends Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data }
    bindAll(this, ['onClick', 'onAction', 'onDragStart'])
    this.id = randomString(5);
  }
  updateData(data){
    const newData = Object.assign(this.props.data, data);
    this.setState({ data:newData });
  }
  componentDidMount(){
    const { data, callDelegate } = this.props;
    callDelegate('onCardSubscribe', data, this.updateData, this.id);
  }
  componentWillUnmount(){
    const { data, callDelegate } = this.props;
    callDelegate('onCardUnsubscribe', data, this.updateData, this.id);
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
    if(headerImage){
      return (
        <img src={headerImage} alt="" />
      )
    }
  }
  renderHeader(actions, title, subtitle, headerImage) {
    const noSubtitleClass = !subtitle ? "swipes-card__header__content--no-subtitle" : '';

    return (
      <div className="swipes-card__header">
        <div className="swipes-card__header__dot">
          {this.renderDot(actions)}
        </div>
        <div className={"swipes-card__header__content " + noSubtitleClass}>
          <div className="swipes-card__header__content--title">{title}</div>
          <div className="swipes-card__header__content--subtitle">{subtitle}</div>
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
          {description}
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
          <div className="swipes-card__preview--iframe">
            <video className="custom-html" src={preview.url} controls></video>
          </div>
        </div>
      )
    }

    if (preview.type === 'image' && isImage) {
      return (
        <div className="swipes-card__preview">
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
      preview
    } = this.props.data;

    return (
      <div id={"swipes-card__item-" + this.id } className="swipes-card__item" onClick={this.onClick}>
        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}
        {this.renderPreview(preview)}
      </div>
    )
  }
}

export default SwipesCardItem

const stringOrNum = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])

SwipesCardItem.propTypes = {
  callDelegate: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
    headerImage: PropTypes.string,
    preview: PropTypes.shape({
      type: PropTypes.oneOf(['html', 'image']).isRequired,
      url: PropTypes.string,
      html: PropTypes.string,
      width: stringOrNum,
      height: stringOrNum
    }),
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      bgColor: PropTypes.string
    }))
  })
}
