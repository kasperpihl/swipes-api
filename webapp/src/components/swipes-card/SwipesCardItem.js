import React, { Component, PropTypes } from 'react';
import { randomString } from '../../classes/utils';
import SwipesDot from '../swipes-dot/SwipesDot';

class SwipesCardItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderDot(actions){
    const { onDragStart, hoverParentId } = this.props;

    return (
      <div className="dot-wrapper">
        <SwipesDot
          onDragStart={onDragStart}
          hoverParentId={hoverParentId}
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
    console.log(subtitle);
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
      <div className="swipes-card__item">
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
  hoverParentId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    subtitle:  PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]),
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
      callback: PropTypes.func.isRequired,
      icon: PropTypes.string,
      bgColor: PropTypes.string
    }))
  }),
  onDragStart: PropTypes.func
}
