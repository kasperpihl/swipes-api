import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'src/react/components/loaders/Loader';
import { setupDelegate } from 'react-delegate';
import { setupCachedCallback } from 'react-delegate';
import ResultItem from 'src/react/components/result-item/ResultItem';
import SW from './TabMenu.swiss';

// now use events as onClick:
class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onActionCached = setupCachedCallback(this.onAction, this);
    setupDelegate(this, 'onItemAction');
  }
  onAction(i, side, e) {
    const { results, hide } = this.props;
    const item = results[i];

    this.onItemAction(item, side, e);

    if (item.hideAfterClick === true) {
      hide();
    }
  }
  renderResults() {
    const { results } = this.props;

    if (results) {
      return results.map((r, i) => (
        <ResultItem onClick={this.onActionCached(i)} key={i} {...r} />
      ));
    }

    return undefined;
  }
  renderLoader() {
    const { loading } = this.props;

    if (!loading) {
      return undefined;
    }

    return <Loader center mini size={30} />;
  }
  render() {
    return (
      <SW.List>
        {this.renderResults()}
        {this.renderLoader()}
      </SW.List>
    );
  }
}

export default ResultList;

const { arrayOf, bool, shape, object } = PropTypes;

ResultList.propTypes = {
  results: arrayOf(shape(ResultItem.propTypes)),
  delegate: object,
  loading: bool
};
