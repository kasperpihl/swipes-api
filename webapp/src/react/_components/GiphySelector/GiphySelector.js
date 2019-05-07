import React, { PureComponent } from 'react';
import GiphySelect from 'react-giphy-select';
import 'react-giphy-select/lib/styles.css';
import SW from './GiphySelector.swiss.js';

export default class GiphySelector extends PureComponent {
  render() {
    const theme = {
      select: 'wrapper',
      selectInput: 'input',
      attribution: 'attribution'
    };
    const { onEntrySelect } = this.props;
    return (
      <SW.Wrapper>
        <GiphySelect
          requestKey="1YZHVzT1opsINgxZkmdyaB8Y9VdESZB5"
          requestRating="r"
          onEntrySelect={onEntrySelect}
          theme={theme}
        />
      </SW.Wrapper>
    );
  }
}
