import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/styled-text.scss';

class StyledText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onTextClick', 'onTextMouseEnter', 'onTextMouseLeave');
  }
  render() {
    const { text, textStyle, className } = this.props;

    return (
      <div className={`styled-text ${className || ''}`} style={textStyle}>
        {text.map((t, i) => {
          if (typeof t === 'string') {
            return t;
          }

          const {
            id,
            string,
            className,
            ...rest,
          } = t;
          return (
            <button
              onMouseEnter={this.onTextMouseEnterCached(t.id, t)}
              onMouseLeave={this.onTextMouseLeaveCached(t.id, t)}
              onClick={this.onTextClickCached(t.id, t)}
              className={`styled-text__selector ${className || ''}`}
              key={t.id + '' + i}
              {...rest}
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
