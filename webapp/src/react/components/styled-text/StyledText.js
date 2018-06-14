import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SW from './StyledText.swiss';

class StyledText extends PureComponent {
  render() {
    const { text, textStyle, className } = this.props;

    return (
      <SW.Wrapper className={className} style={textStyle}>
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
              key={t.id + '' + i}
              {...rest}
            >
              {t.string}
            </button>
          );
        })}
      </SW.Wrapper>
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
