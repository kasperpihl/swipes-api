import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import ResultItem from 'src/react/components/result-item/ResultItem';
import AutoCompleteItem from './AutoCompleteItem';
import SW from './AutoCompleting.swiss';

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
    const showOnTop = autoComplete.getIn(['options', 'showOnTop']);
    const show = (autoComplete.get('results') && boundingRect);

    return (
      <SW.Wrapper
        className="auto-completing"
        show={show}
        boundingRect={boundingRect}
        showOnTop={showOnTop}
      >
        {show && this.renderResults()}
      </SW.Wrapper>
    )
  }
}

export default AutoCompleting
