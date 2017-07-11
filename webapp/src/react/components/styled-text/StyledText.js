import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/styled-text.scss';

class StyledText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onTextClick', 'onTextMouseEnter', 'onTextMouseLeave');
  }
  componentDidMount() {
  }
  render() {
    const { text, textStyle } = this.props;

    return (
      <div className="styled-text" style={textStyle}>
        {text.map((t) => {
          if (typeof t === 'string') {
            return t;
          }

          return (
            <button
              onMouseEnter={this.onTextMouseEnterCached(t.id, t)}
              onMouseLeave={this.onTextMouseLeaveCached(t.id, t)}
              onClick={this.onTextClickCached(t.id, t)}
              className="styled-text__selector"
              key={t.id}
              style={t.style}
            >
              {t.string}
            </button>
          );
        })}
      </div>
    );
  }
}

export default StyledText

const { string, shape, arrayOf, oneOfType } = PropTypes;

StyledText.propTypes = {
  text: arrayOf(oneOfType([
    string,
    shape({
      id: string.isRequired,
      string: string.isRequired,
    }),
  ])).isRequired,
};
