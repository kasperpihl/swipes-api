import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles/styled-text.scss';

class StyledText extends PureComponent {
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
