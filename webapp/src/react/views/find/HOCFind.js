import React, { Component, PropTypes } from 'react';
import { list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import SWView from 'SWView';
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
      } else {
        search();
      }
    }
  }
  onPreviewLink(obj) {
    const { preview, actionCallback } = this.props;
    let buttons = [];
    if (actionCallback) {
      buttons = [{
        title: 'Attach to Goal',
        onClick: () => {
          actionCallback(obj);
        },
      }];
    }
    preview(obj, { buttons });
  }
  findItemAction(i) {
    const { searchResults, actionCallback } = this.props;
    const obj = searchResults.get(i);
    if (obj && actionCallback) {
      const { service, permission, title } = obj.toJS();
      actionCallback({ service, permission, meta: { title } });
    }
  }
  findSearch(query) {
    const { search } = this.props;
    search(query);
  }
  findItemClick(i) {
    const { searchResults } = this.props;
    const obj = searchResults.get(i).toJS();
    this.onPreviewLink({
      permission: obj.permission,
      service: obj.service,
      meta: { title: obj.title },
    });
  }
  renderBrowse() {
    const { searchQuery, searching } = this.props;
    if (searchQuery || searching) {
      return undefined;
    }
    return <HOCBrowse delegate={this} />;
  }
  renderSearchResults() {
    const { searchResults, searching, searchQuery, actionLabel } = this.props;
    if (!searchQuery && !searching) {
      return undefined;
    }
    return (
      <SWView maxWidth={780}>
        <Find
          results={searchResults}
          searching={searching}
          actionLabel={actionLabel}
          searchQuery={searchQuery}
          delegate={this}
        />
      </SWView>
    );
  }
  render() {
    return (
      <div className="find-container">
        {this.renderBrowse()}
        {this.renderSearchResults()}
      </div>
    );
  }
}

const { func, bool, string, object } = PropTypes;

HOCFind.propTypes = {
  actionCallback: func,
  actionLabel: string,
  delegate: object,
  preview: func,
  search: func,
  searching: bool,
  searchQuery: string,
  searchResults: list,
};

function mapStateToProps(state) {
  return {
    searchResults: state.getIn(['search', 'searchResults']),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
  };
}

const ConnectedHOCFind = connect(mapStateToProps, {
  preview: actions.main.preview,
  request: actions.api.request,
  search: actions.main.search,
})(HOCFind);
export default ConnectedHOCFind;
