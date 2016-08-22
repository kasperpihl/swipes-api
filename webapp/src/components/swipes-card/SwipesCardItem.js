import React, { Component, PropTypes } from 'react';
import { randomString } from '../../classes/utils';
import SwipesDot from '../swipes-dot/SwipesDot';

class SwipesCardItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.id = randomString(5);
  }
  componentDidMount() {
  }
  renderDot(actions){
    // add back to swipesdot elements={[actions]}
    const { onDragStart } = this.props;

    return (
      <div className="dot-wrapper">
        <SwipesDot
          onDragStart={onDragStart}
          hoverParentId={'card-container' + this.id}
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
  render() {
    const {
      title,
      subtitle,
      description,
      headerImage,
      actions
    } = this.props.data;

    return (
      <div className="swipes-card__item">
        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}
      </div>
    )
  }
}

export default SwipesCardItem

SwipesCardItem.propTypes = {
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
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
      icon: PropTypes.string,
      bgColor: PropTypes.string
    }))
  }),
}
