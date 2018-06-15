import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import PropTypes from 'prop-types';

import styles from './StyledText.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class StyledText extends PureComponent {
  render() {
    const { text, textStyle, className } = this.props;

    return (
      <Wrapper className={className} style={textStyle}>
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
      </Wrapper>
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
