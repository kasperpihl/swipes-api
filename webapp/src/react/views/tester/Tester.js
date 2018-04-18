import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';

const styles = {
  Wrapper: {
    _flex: ['row', 'center', 'center'],
    padding: '10px',
    '& .DraftEditor-root': {
      width: '100%',
    }
  },
};

const Wrapper = styleElement('div', styles.Wrapper);

class Tester extends PureComponent {
  render() {
    return (
      <Wrapper>
        Hi
      </Wrapper>
    );
  }
}

export default Tester;