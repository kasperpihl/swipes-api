import React, { Component, PropTypes } from 'react';
import { randomString, bindAll, decodeHtml } from 'classes/utils';
import Icon from 'Icon';

class SwipesCardItem extends Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['onClick', 'updateData', 'onAction', 'onDragStart', 'clickedLink', 'openImage']);
    this.id = randomString(5);
  }
  componentDidMount() {
    const { data } = this.props;
    if (data.shortUrl) {
      window.swipesUrlProvider.subscribe(data.shortUrl, this.updateData, this.id);
    }
  }
  componentWillUpdate(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      const newData = Object.assign(this.state.data, nextProps.data);
      this.setState({ data: newData });
    }
  }
  componentWillUnmount() {
    const { data } = this.props;

    if (data.shortUrl) {
      window.swipesUrlProvider.unsubscribe(data.shortUrl, this.updateData, this.id);
    }
  }
  onClick() {
    const { data, callDelegate } = this.props;

    if (!window.getSelection().toString().length) {
      callDelegate('onCardClick', data);
    }
  }
  onAction(action) {
    const { data, callDelegate } = this.props;
    if (action.label === 'Share') {
      callDelegate('onCardShare', data);
    } else {
      callDelegate('onCardAction', data, action);
    }
  }
  onDragStart() {
    const { data, callDelegate } = this.props;
    callDelegate('onCardShare', data, true);
  }
  clickedLink(match, e) {
    const res = match.split('|');
    // console.log('clicked', res);

    this.props.callDelegate('onCardClickLink', res);
    e.stopPropagation();
  }
  updateData(data) {
    const newData = Object.assign({}, this.state.data, data);

    this.setState({ data: newData });
  }
  openImage() {

  }
  isVideo(url) {
    if (!url) {
      return false;
    }
    return (url.match(/\.(mov|mp4)$/) != null);
  }
  isImage(url) {
    if (!url) {
      return false;
    }
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }
  iconForService(service) {
    switch (service) {
      case 'slack':
        return 'SlackLogo';
      case 'dropbox':
        return 'DropboxLogo';
      default:
        return 'SwipesLogo';
    }
  }
  renderHeaderImage(headerImage) {
    if (!headerImage) {
      return undefined;
    }

    return (
      <img src={headerImage} alt="" />
    );
  }
  renderIcon(icon) {
    if (<Icon svg={icon} />) {
      return (
        <Icon
          svg={icon}
          className="swipes-card__header__icon swipes-card__header__icon--svg"
        />
      );
    }

    return (
      <img
        src={icon}
        className="material-icons swipes-card__header__icon swipes-card__header__icon--imaget"
        alt=""
      />
    );
  }
  renderService(service) {
    service = service || 'swipes';
    const icon = this.iconForService(service);
    return (
      <div className="swipes-card__header__service">
        {this.renderIcon(icon)} {service}
      </div>
    );
  }
  renderHeader() {
    const {
      thumbnail,
      title,
      subtitle,
      service,
    } = this.state.data;
    const noSubtitleClass = !subtitle ? 'swipes-card__header__content--no-subtitle' : '';

    return (
      <div className="swipes-card__header">
        <div className="swipes-card__header__image">{this.renderHeaderImage(thumbnail)}</div>
        <div className={`swipes-card__header__content ${noSubtitleClass}`}>
          <div
            className="swipes-card__header__content--title"
          >
            {this.renderTextWithLinks(title)}
          </div>
          <div
            className="swipes-card__header__content--subtitle"
          >
            {this.renderTextWithLinks(subtitle)}
          </div>
          {this.renderService(service)}
        </div>
      </div>
    );
  }
  renderDescription(description) {
    if (!description) {
      return undefined;
    }

    return (
      <div className="description-container">
        <div className="swipes-card__description">
          {this.renderTextWithLinks(description)}
        </div>
      </div>
    );
  }
  renderPreview(preview) {
    if (!preview) {
      return undefined;
    }

    const isImage = this.isImage(preview.url);
    const isVideo = this.isVideo(preview.url);

    if (isVideo) {
      return (
        <div className="swipes-card__preview swipes-card__preview--no-style">
          <div className="swipes-card__preview--video">
            <video className="custom-html" src={preview.url} controls />
          </div>
        </div>
      );
    }

    if (preview.type === 'image' && isImage) {
      const { cardPreview } = this.refs;


      if (cardPreview) {
        if (preview.width > cardPreview.clientWidth) {
          preview.height = (preview.height * cardPreview.clientWidth) / preview.width;
          preview.width = cardPreview.clientWidth;
        }
      }
      return (
        <div className="swipes-card__preview" ref="cardPreview">
          <div className="swipes-card__preview--img" onClick={this.openImage}>
            <img src={preview.url} height={preview.height} width={preview.width} alt="" />
          </div>
        </div>
      );
    }

    if (preview.type === 'html') {
      return (
        <div className="swipes-card__preview swipes-card__preview--no-style">
          <div className="swipes-card__preview--iframe">
            <div
              className="custom-html"
              dangerouslySetInnerHTML={{ __html: preview.html }} // eslint-disable-line
            />
          </div>
        </div>
      );
    }

    return undefined;
  }
  renderTextWithLinks(text) {
    if (!text || !text.length) {
      return text;
    }

    const matches = text.match(/<(.*?)>/g);

    const replaced = [];

    if ((matches != null) && matches.length) {
      const splits = text.split(/<(.*?)>/g);

      // Adding the text before the first match
      replaced.push(splits.shift());
      for (let i = 0; i < matches.length; i += 1) {
        // The match is now the next object
        const innerMatch = splits.shift();

        // Else add the link with the proper title
        const res = innerMatch.split('|');
        const title = res[res.length - 1];

        replaced.push(<a key={`link${i}`} className="link" onClick={this.clickedLink.bind(null, innerMatch)}>{decodeHtml(title)}</a>); // eslint-disable-line

        // Adding the after text between the matches
        replaced.push(decodeHtml(splits.shift()));
      }
      if (replaced.length) {
        return replaced;
      }
    }
    return decodeHtml(text);
  }
  render() {
    const {
      description,
      preview,
    } = this.state.data;

    return (
      <div id={`swipes-card__item-${this.id}`} className="swipes-card__item" onClick={this.onClick}>
        {this.renderHeader()}
        {this.renderDescription(description)}
        {this.renderPreview(preview)}
      </div>
    );
  }
}

export default SwipesCardItem;

const { string, number, shape, oneOf, oneOfType, arrayOf, func } = PropTypes;


SwipesCardItem.propTypes = {
  callDelegate: func.isRequired,
  data: shape({
    id: oneOfType([string, number]),
    shortUrl: string,
    title: string,
    subtitle: string,
    service: string,
    description: string,
    headerImage: string,
    preview: shape({
      type: oneOf(['html', 'image']).isRequired,
      url: string,
      html: string,
      width: oneOfType([string, number]),
      height: oneOfType([string, number]),
    }),
    actions: arrayOf(shape({
      label: string.isRequired,
      icon: string,
      bgColor: string,
    })),
  }),
};
