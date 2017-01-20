import React, { Component, PropTypes } from 'react';
import ResultItem from './ResultItem';
import Loader from 'components/swipes-ui/Loader';

class ResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderResults() {
    const { results } = this.props;

    if (results) {
      return results.map((r, i) => <ResultItem key={i} {...r} />);
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

const { arrayOf, bool, shape } = PropTypes;

ResultList.propTypes = {
  results: arrayOf(shape(ResultItem.propTypes)),
  loading: bool,
};
