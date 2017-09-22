import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { setupDelegate } from 'react-delegate';
import * as cs from 'swipes-core-js/selectors';
import { ImmutableListView } from 'react-native-immutable-list-view';
import WaitForUI from 'WaitForUI';
import EmptyListFooter from 'components/empty-list-footer/EmptyListFooter';
import { colors } from 'globalStyles';
import SearchResult from './SearchResult';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 33,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 15,
    color: colors.deepBlue70,
    lineHeight: 21,
    textAlign: 'center'
  }
});

class HOCSearchResults extends PureComponent {
  constructor(props) {
    super(props);
    
    this.renderResultRow = this.renderResultRow.bind(this);
    setupDelegate(this, 'willOpenResult');
  }
  componentDidMount() {
  }
  renderEmptyState(type) {
    let label = 'Search for plans, goals or\n discussions by keywords.'

    if (type === 'noresults') {
      label = 'Oops! Nothing found.'
    }

    return (
      <View style={styles.emptyState} >
        <Text style={styles.emptyLabel} >{label}</Text>
      </View>
    )
  }
  renderResultRow(result) {
    return <SearchResult result={result} delegate={this.props.delegate} />
  }
  renderListFooter() {
    
    return <EmptyListFooter />
  }
  renderResults() {
    const { results } = this.props;

    if (results && results.length) {
      const immutableRes = List(results);

      return (
        <ImmutableListView
          style={styles.list}
          immutableData={immutableRes}
          renderRow={this.renderResultRow}
          renderFooter={this.renderListFooter}
        />
      );
    }

    if (!results) return this.renderEmptyState('nosearch');

    if (results && !results.length) return this.renderEmptyState('noresults')

    return undefined;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderResults()}
      </View>
    );
  }
}
// const { string } = PropTypes;

HOCSearchResults.propTypes = {};

function mapStateToProps(state, props) {
  return {
    results: cs.global.search(state, props),
  };
}

export default connect(mapStateToProps, {
})(HOCSearchResults);
