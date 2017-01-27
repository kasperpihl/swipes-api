import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
import HOCBrowse from './browse/HOCBrowse';
import Find from './Find';
import './styles/find.scss';

// ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class HOCFind extends Component {
  constructor(props) {
    super(props);
    this.unhandledDocs = [];
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
    const input = document.getElementById('navbar-input');
    input.focus();
  }
  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      const { search } = this.props;
      if (e.target.value.length > 2) {
        search(e.target.value);
      }
    }
  }
  findItemShare() {
    // const { searchResults } = this.props;
  }
  findItemAction(i) {
    const { searchResults, actionCallback } = this.props;
    const obj = searchResults.get(i);
    if (obj && actionCallback) {
      const { service, permission, title } = obj.toJS();
      actionCallback(service, permission, { title });
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
  renderBrowse() {
    const { searchResults, searching } = this.props;
    if (searchResults && searching || searchResults.size) {
      return undefined;
    }
    return <HOCBrowse />;
  }
  renderSearchResults() {
    const { searchResults, searching, searchQuery, actionLabel } = this.props;

    if (!searchResults && !searching) {
      return undefined;
    }
    return (
      <Find
        results={searchResults}
        searching={searching}
        actionLabel={actionLabel}
        searchQuery={searchQuery}
        delegate={this}
      />
    );
  }
  render() {
    console.log('hello');
    return (
      <div className="find">
        {this.renderBrowse()}
        {this.renderSearchResults()}
      </div>
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
