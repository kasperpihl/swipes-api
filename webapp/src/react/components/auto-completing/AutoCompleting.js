import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import prefixAll from 'inline-style-prefixer/static';
import { resolveArrayValue } from 'css-in-js-utils';
import ResultItem from 'components/result-item/ResultItem';
import AutoCompleteItem from './AutoCompleteItem';
import './styles/auto-completing.scss';

class AutoCompleting extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  renderResults() {
    const { results, selectedIndex, alignToTop, autoComplete } = this.props;
    if(!results) {
      return undefined;
    }
    let resultHtml = results.map((r, i) => {
      return (
        <AutoCompleteItem
          key={autoComplete.get('string') + i}
          item={r.item}
          selected={(i === selectedIndex)}
          alignToTop={alignToTop}
        >
          <ResultItem
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
    const { autoComplete, results } = this.props;
    const boundingRect = autoComplete.getIn(['options', 'boundingRect']);
    let className = 'auto-completing';
    const style = {};
    if(results && results.length && boundingRect) {
      className += ' auto-completing--shown';
      style.width = 360 + 'px';
      style.height = 250 + 'px';
      style.top = (boundingRect.bottom) + 'px';
      if(autoComplete.getIn(['options', 'showOnTop'])) {
        style.top = (boundingRect.top - 250) + 'px';
      }
      style.left = boundingRect.left + 'px';
    }

    return (
      <div className={className} style={prefixAll(style)}>
        {this.renderResults()}
      </div>
    )
  }
}

export default AutoCompleting

// const { string } = PropTypes;

AutoCompleting.propTypes = {};
