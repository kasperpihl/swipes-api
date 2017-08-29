import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import { URL_REGEX } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/TextParser.scss';

class TextParser extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onLinkClick');
  }
  componentDidMount() {
  }
  renderStuff(regex, inputArray, renderMethod) {
    let resArray = [];
    if(typeof inputArray === 'string') {
      inputArray = [inputArray];
    }
    inputArray.forEach((string) => {
      if(typeof string !== 'string'){
        return resArray.push(string);
      }
      const matches = string.match(regex);
      if(matches) {
        let innerSplits = string.split(regex);
        matches.forEach((match, i) => {
          innerSplits.splice(1 + i + i, 0, renderMethod.call(null, match, i));
        });
        resArray = resArray.concat(innerSplits);
      } else {
        resArray.push(string);
      }
    });
    return resArray;
  }
  render() {
    const {
      children,
      ...rest,
    } = this.props;
    let text = children || '';

    const newLinesArray = text.split('\n');
    const newLinesCount = newLinesArray.length - 1;
    const message = newLinesArray.map((item, key) => {
      const newLine = newLinesCount === key ? null : (<br />);
      item = this.renderStuff(URL_REGEX, item, (url, i) => (
        <a
          onClick={this.onLinkClickCached(url)}
          className="link"
          key={`link${i}`}
        >
          {url}
        </a>
      ));
      return (
        <span key={key}>{item}{newLine}</span>
      );
    });

    return (
      <div {...rest}>
        {message}
      </div>
    );
  }
}

export default TextParser

const { string } = PropTypes;

TextParser.propTypes = {
  children: string,
};
