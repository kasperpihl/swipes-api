import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import Find from './Find';
import './styles/find.scss';

// ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class HOCFind extends Component {
  constructor(props) {
    super(props);
    this.unhandledDocs = [];
  }
  componentDidMount() {
  }
  findItemShare() {
    // const { searchResults } = this.props;
  }
  findItemAction(i) {
    const { searchResults, actionCallback } = this.props;
    const obj = searchResults.get(i);
    if (obj && actionCallback) {
      const { service, permission, meta } = obj.toJS().shareData;
      actionCallback(service, permission, meta);
    }
    console.log(obj.toJS());
  }
  findSearch(query) {
    const { search } = this.props;
    search(query);
  }
  findItemClick(i) {
    const { preview, searchResults } = this.props;
    const obj = searchResults.get(i);
    preview({
      permission: obj.get('permission'),
      service: obj.get('service'),
    });
  }
  render() {
    const { searchResults, searching, searchQuery, actionLabel, browseQuery } = this.props;
    return (
      <Find
        results={searchResults}
        browseQuery={browseQuery}
        searching={searching}
        actionLabel={actionLabel}
        searchQuery={searchQuery}
        delegate={this}
      />
    );
  }
}

const { func, bool, string } = PropTypes;

HOCFind.propTypes = {
  request: func,
  actionLabel: string,
  actionCallback: func,
  loadModal: func,
  search: func,
  searchResults: list,
  searching: bool,
  searchQuery: string,
};

function mapStateToProps(state) {
  return {
    searchResults: state.getIn(['search', 'searchResults']),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
  };
}

const ConnectedHOCFind = connect(mapStateToProps, {
  search: actions.main.search,
  request: actions.api.request,
  loadModal: actions.modal.load,
  preview: actions.main.preview,
})(HOCFind);
export default ConnectedHOCFind;
