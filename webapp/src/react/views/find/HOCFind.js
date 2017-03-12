import React, { Component, PropTypes } from 'react';
import { list, map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import * as actions from 'actions';
import SWView from 'SWView';
import Button from 'Button';
import { setupDelegate, bindAll } from 'classes/utils';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCBrowse from './browse/HOCBrowse';
import SearchResults from './SearchResults';
import BrowseSectionList from './browse/BrowseSectionList';

import './styles/find.scss';

// ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class HOCFind extends Component {
  static minWidth() {
    return 800;
  }
  static maxWidth() {
    return 1600;
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 'search-results',
      accountId: null,
      serviceName: null,
      searchQ: '',
    };
    this.unhandledDocs = [];
    this.callDelegate = setupDelegate(props.delegate);
    bindAll(this, ['onInputChange', 'onInputKeyUp', 'onConnectService']);
  }
  onInputChange(e) {
    this.setState({ searchQ: e.target.value });
  }
  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      const { search } = this.props;
      const { searchQ } = this.state;
      if (searchQ.length > 2) {
        if (this.state.selectedId !== 'search-results') {
          this.setState({
            selectedId: 'search-results',
          });
        }
        search(searchQ);
      } else {
        search();
      }
    }
  }
  onPreviewLink(obj) {
    const { openPreview, onAttach, goalId, target } = this.props;
    openPreview(target, {
      loadPreview: obj,
      onAttach,
      goalId,
    });
  }
  onConnectService() {
    const { openSecondary } = this.props;
    openSecondary({
      id: 'Services', title: 'Services',
    });
  }
  navbarLoadedInput(input) {
    this._input = input;
    this.focusNavInput();
  }
  focusNavInput() {
    if (this._input) {
      const input = this._input;
      input.focus();
      if (input.value.length) {
        input.setSelectionRange(0, input.value.length);
      }
    }
  }
  clickedItem(depth, id, i, entry) {
    this.setState({
      selectedId: id,
      serviceName: entry.serviceName,
      accountId: entry.accountId,
    });
  }
  findItemAttach(i, e) {
    const { searchResults, onAttach, attachToGoal } = this.props;
    const obj = searchResults.get(i);
    const { service, permission, title } = obj.toJS();
    const shareObj = { service, permission, meta: { title } };
    if (onAttach) {
      onAttach(shareObj, e);
    } else {
      attachToGoal(shareObj);
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
  renderNavbar() {
    const { target } = this.props;
    const { searchQ } = this.state;

    return (
      <HOCHeaderTitle
        onChange={this.onInputChange}
        onKeyUp={this.onInputKeyUp}
        delegate={this}
        placeholder="Search across Dropbox, Slack etc."
        value={searchQ}
        target={target}
      />
    );
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
  renderEmpty() {
    const { me } = this.props;
    const numberOfServices = me.get('services').size;
    return (
      <div className="find__setup">
        <h1>Search and Find</h1>
        <h2>
          Here is the power house of your workspace.
          It connects to all your services and helps you quickly search through them.
        </h2>
        <Button
          text="Connect new service"
          primary
          onClick={this.onConnectService}
        />
      </div>
    );
  }
  renderSearchResults() {
    const { searchResults, searching, searchQuery } = this.props;
    if (!searchQuery && !searching) {
      return this.renderEmpty();
    }
    return (
      <SWView>
        <SearchResults
          results={searchResults}
          searching={searching}
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
    const serviceItems = myServices.map((s, i) => {
      let title = services.getIn([s.get('service_id'), 'title']);
      const curr = s.get('service_name');
      const pre = myServices.getIn([i - 1, 'service_name']);
      const next = myServices.getIn([i + 1, 'service_name']);
      if (curr === pre || curr === next) {
        title += ` (${s.get('show_name')})`;
      }
      return {
        id: `browse-${s.get('service_name')}-${s.get('id')}`,
        serviceName: s.get('service_name'),
        accountId: s.get('id'),
        title,
      };
    }).toArray();
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
        items: serviceItems,
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
      <SWView header={this.renderNavbar()}>
        <div className="find">
          <div className="find__sidebar">
            {this.renderSidebar()}
          </div>
          <div className="find__content">
            {this.renderContent()}
          </div>
        </div>
      </SWView>
    );
  }
}

const { func, bool, string, object } = PropTypes;

HOCFind.propTypes = {
  onAttach: func,
  delegate: object,
  openPreview: func,
  search: func,
  searching: bool,
  searchQuery: string,
  target: string,
  searchResults: list,
  me: map,
  services: map,
};

function mapStateToProps(state) {
  return {
    searchResults: state.getIn(['search', 'searchResults']),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
    services: state.get('services'),
    me: state.get('me'),
  };
}

const ConnectedHOCFind = connect(mapStateToProps, {
  openPreview: actions.links.openPreview,
  attachToGoal: actions.goals.attachToGoal,
  request: actions.api.request,
  search: actions.main.search,
})(HOCFind);
export default ConnectedHOCFind;
