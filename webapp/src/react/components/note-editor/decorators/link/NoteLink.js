import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import './styles/link.scss';
function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText() || '';
  let start;
  let matchArr = regex.exec(text);
  while (matchArr !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
    matchArr = regex.exec(text);
  }
}

class NoteLink extends Component {
  static strategy(contentBlock, callback, contentState) {
    const URL_REGEX = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi;

    findWithRegex(URL_REGEX, contentBlock, callback);
    contentBlock.findEntityRanges(
      (character) => {
        const entity = character.getEntity();
        return (
          entity !== null &&
          contentState.getEntity(entity).get('type') === 'LINK'
        );
      },
      callback,
    );
  }
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.ctx);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    const { entityKey, contentState, decoratedText } = this.props;
    let data = decoratedText;
    if (entityKey !== null) {
      data = contentState.getEntity(entityKey).get('data').url;
    }
    this.callDelegate('onLinkClick', data);
  }
  render() {
    const { children } = this.props;

    return (
      <a className="DraftEditor-link" onClick={this.onClick}>
        {children}
      </a>
    );
  }
}

export default NoteLink;

const { string, arrayOf, object } = PropTypes;

NoteLink.propTypes = {
  entityKey: string,
  decoratedText: string,
  ctx: object,
  contentState: object,
  children: arrayOf(object),
};
