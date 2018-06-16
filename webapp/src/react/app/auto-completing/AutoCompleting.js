import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
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
    console.log(selectedIndex);

    let resultHtml = autoComplete.get('results').map((r, i) => {
      return (
        <AutoCompleteItem
          key={autoComplete.get('string') + i}
          item={r.item}
          selected={i === selectedIndex}
          alignToTop={alignToTop}
        >
          <ResultItem
            selected={i === selectedIndex}
            onMouseDown={this.onSelectRowCached(i)}
            {...r.resultItem}
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
    const showOnTop = autoComplete.getIn(['options', 'showOnTop']);
    const show = (autoComplete.get('results') && boundingRect);

    return (
      <Wrapper
        className="auto-completing"
        show={show}
        boundingRect={boundingRect}
        showOnTop={showOnTop}
      >
        {show && this.renderResults()}
      </Wrapper>
    )
  }
}

export default AutoCompleting
