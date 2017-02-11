import React, { Component, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as actions from 'actions';
import SWView from 'SWView';
import { setupDelegate } from 'classes/utils';
import HOCBrowse from './browse/HOCBrowse';
import Find from './Find';
import BrowseSectionList from './browse/BrowseSectionList';

import './styles/find.scss';

// ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class HOCFind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 'search-results',
      accountId: null,
      serviceName: null,
    };
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
  clickedItem(depth, id, i, entry) {
    this.setState({
      selectedId: id,
      serviceName: entry.serviceName,
      accountId: entry.accountId,
    });
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
    const {
      selectedId,
      serviceName,
      accountId,
    } = this.state;

    return (
      <HOCBrowse
        delegate={this}
        id={selectedId}
        serviceName={serviceName}
        accountId={accountId}
      />
    );
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
  renderSidebar() {
    const { me, services } = this.props;
    const myServices = me.get('services')
                          .filter(s => services.getIn([s.get('service_id'), 'browse']))
                          .sort((a, b) => a.get('service_name').localeCompare(b.get('service_name')));
    const { selectedId } = this.state;

    const props = {
      delegate: this,
      selectedId,
      disableFavorite: true,
      sections: [{
        title: 'Search',
        items: [
          { id: 'search-results', title: 'Results', leftIcon: 'Find' },
        ],
      }, {
        title: 'Browse',
        items: myServices.map(s => ({
          id: `browse-${s.get('service_name')}-${s.get('id')}`,
          serviceName: s.get('service_name'),
          accountId: s.get('id'),
          title: services.getIn([s.get('service_id'), 'title']),
        })).toArray(),
      }, {
        title: 'Shortcuts',
        items: [
          { id: '1', title: 'Brand Guidelines', leftIcon: 'Note' },
          { id: '2', title: 'Design notes', leftIcon: 'Note' },
          { id: '3', title: 'Production', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { id: '4', title: 'Prototype', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { id: '5', title: 'creative', leftIcon: 'Hashtag', rightIcon: 'ArrowRightLine' },
          { id: '6', title: 'general', leftIcon: 'Hashtag', rightIcon: 'ArrowRightLine' },
          { id: '7', title: 'Kasper', leftIcon: 'Person' },
          { id: '8', title: 'Journal', leftIcon: 'Note' },
        ],
      }],
    };
    return <BrowseSectionList {...props} />;
  }
  renderContent() {
    const { selectedId } = this.state;
    if (selectedId.startsWith('search')) {
      return this.renderSearchResults();
    }
    if (selectedId.startsWith('browse')) {
      return this.renderBrowse();
    }
    return undefined;
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
  me: map,
  services: map,
};

function mapStateToProps(state) {
  return {
    searchResults: state.getIn(['search', 'searchResults']),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
    services: state.getIn(['main', 'services']),
    me: state.get('me'),
  };
}

const ConnectedHOCFind = connect(mapStateToProps, {
  preview: actions.main.preview,
  request: actions.api.request,
  search: actions.main.search,
})(HOCFind);
export default ConnectedHOCFind;
