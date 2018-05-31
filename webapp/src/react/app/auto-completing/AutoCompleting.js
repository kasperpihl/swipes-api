import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import prefixAll from 'inline-style-prefixer/static';
import ResultItem from 'src/react/components/result-item/ResultItem';
import AutoCompleteItem from './AutoCompleteItem';

import styles from './AutoCompleting.swiss';

const Wrapper = styleElement('div', styles.Wrapper);

class AutoCompleting extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onSelectRow');
  }
  renderResults() {
    const { selectedIndex, alignToTop, autoComplete } = this.props;

    let resultHtml = autoComplete.get('results').map((r, i) => {
      return (
        <AutoCompleteItem
          key={autoComplete.get('string') + i}
          item={r.item}
          selected={(i === selectedIndex)}
          alignToTop={alignToTop}
        >
          <ResultItem
            {...r.resultItem}
            onMouseDown={this.onSelectRowCached(i)}
          />
        </AutoCompleteItem>
      )
    });
    if(autoComplete.getIn(['options', 'showOnTop'])){
      resultHtml = resultHtml.reverse();
    }
    return resultHtml;
  }
  render() {
    const { autoComplete } = this.props;
    const boundingRect = autoComplete.getIn(['options', 'boundingRect']);

    const style = {};
    const show = (autoComplete.get('results') && boundingRect);
    if(show) {
      style.width = 360 + 'px';
      style.height = 250 + 'px';
      style.top = (boundingRect.bottom) + 'px';
      const wh = window.outerHeight;
      
      if(autoComplete.getIn(['options', 'showOnTop'])) {
        style.top = (boundingRect.top - 250) + 'px';
      }
      style.left = boundingRect.left + 'px';
    }

    return (
      <Wrapper className="auto-completing" show={show} style={prefixAll(style)}>
        {show && this.renderResults()}
      </Wrapper>
    )
  }
}

export default AutoCompleting
