import React, { Component, PropTypes } from 'react';
import Loader from 'components/loaders/Loader';
import { setupCachedCallback, setupDelegate } from 'classes/utils';
import ResultItem from './ResultItem';


// now use events as onClick:
class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onActionCached = setupCachedCallback(this.onAction, this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
  }
  onAction(i, side, e) {
    const { results } = this.props;
    this.callDelegate('onItemAction', results[i], side, e);
  }
  renderResults() {
    const { results } = this.props;

    if (results) {
      return results.map((r, i) => <ResultItem onClick={this.onActionCached(i)} key={i} {...r} />);
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
      <div className="tab-menu__list">
        {this.renderResults()}
        {this.renderLoader()}
      </div>
    );
  }
}

export default ResultList;

const { arrayOf, bool, shape, object } = PropTypes;

ResultList.propTypes = {
  results: arrayOf(shape(ResultItem.propTypes)),
  delegate: object,
  loading: bool,
};
