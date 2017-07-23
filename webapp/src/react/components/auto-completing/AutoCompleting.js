import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import AutoCompleteItem from './AutoCompleteItem';
import './styles/auto-completing.scss';

class AutoCompleting extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderResults() {
    const { results, selectedIndex, alignToTop, autoComplete } = this.props;
    if(!results) {
      return undefined;
    }
    return results.map((r, i) => {
      return (
        <AutoCompleteItem
          key={autoComplete.get('string') + i}
          item={r.item}
          selected={(i === selectedIndex)}
          alignToTop={alignToTop}
        />
      )
    }).reverse();
  }
  render() {
    const { autoComplete, results } = this.props;
    const boundingRect = autoComplete.get('boundingRect');
    let className = 'auto-completing';
    const style = {};
    if(results && boundingRect) {
      className += ' auto-completing--shown';
      style.width = 400 + 'px';
      style.height = 250 + 'px';
      style.top = (boundingRect.top - 250) + 'px';
      style.left = boundingRect.left + 'px';
    }

    return (
      <div className={className} style={style}>
        {this.renderResults()}
      </div>
    )
  }
}

export default AutoCompleting

// const { string } = PropTypes;

AutoCompleting.propTypes = {};
