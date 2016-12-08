import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Find from './Find';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';

import './styles/find.scss';

import SearchResults from './SearchResults';
// ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class HOCFind extends Component {
  constructor(props) {
    super(props);

    bindAll(this, ['onKeyUp', 'onCardClick']);
    this.unhandledDocs = [];
  }
  componentDidMount() {
  }
  onCardClick(card, data) {
    const { searchResults, request, loadModal } = this.props;

    if (data.xendo_id) {
      const obj = searchResults.find((res) => {
        const id = res.getIn(['doc', 'id']);

        return id === data.xendo_id;
      });

      if (obj) {
        const doc = obj.get('doc').toJS();

        if (doc.source === 'dropbox') {
          const id = doc.id.split('-')[1];

          loadModal('preview', {
            loading: true,
          });

          request('services.request', {
            service_name: 'dropbox',
            account_id: doc.account_id,
            data: {
              method: 'files.getTemporaryLink',
              parameters: {
                path: `rev:${id}`,
              },
            },
          }).then((res) => {
            if (res && res.data && res.data.link) {
              const dropboxFolder = localStorage.getItem('dropbox-folder');
              const fullFilePath = dropboxFolder + res.data.metadata.path_display;
              const type = doc.source_content_type;
              const link = res.data.link;
              const buttons = [];
              const newData = {
                type: null,
                title: doc.filename,
              };

              if (dropboxFolder) {
                buttons.push({
                  icon: 'DesktopIcon',
                  title: 'Open on Desktop',
                  onClick: () => {
                    window.ipcListener.sendEvent('showItemInFolder', fullFilePath);
                  },
                });
              }

              buttons.push({
                icon: 'EarthIcon',
                title: 'Open in Dropbox.com',
                onClick: () => {
                  const url = `https://www.dropbox.com/home${doc.filepath}/${doc.filename}`;
                  window.ipcListener.sendEvent('openExternal', url);
                },
              }, {
                icon: 'DownloadIcon',
                title: 'Download',
                onClick: () => {
                  window.location.replace(link);
                },
              });

              newData.actions = buttons;

              // const path = res.data.metadata.path_display;

              if (['image/png', 'image/gif', 'image/jpeg', 'image/jpg'].indexOf(type) > -1) {
                newData.img = res.data.link;
                newData.type = 'image';
              }
              if (['application/pdf'].indexOf(type) > -1) {
                newData.pdf = res.data.link;
                newData.type = 'pdf';
              }
              loadModal('preview', newData, () => {
              });
            }
          });
        }
      }
    }
  }
  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.props.search(this.refs.searchInput.value);
    }
  }
  renderSearchField() {
    return (
      <input
        type="text"
        onKeyUp={this.onKeyUp}
        ref="searchInput"
        className="find-overlay__input"
        placeholder="Search"
      />
    );
  }
  renderContent() {
    const { groupedResults, searching, searchQuery } = this.props;

    return (
      <SearchResults
        searching={searching}
        query={searchQuery}
        title="Search"
        results={groupedResults.toJS()}
        cardDelegate={this}
      />
    );
  }
  render() {
    return (
      <div className="find-overlay">
        <Find />
      </div>
    );
  }
}

const { func, bool, string } = PropTypes;

HOCFind.propTypes = {
  searchResults: list,
  request: func,
  loadModal: func,
  search: func,
  groupedResults: map,
  searching: bool,
  searchQuery: string,
};

function mapStateToProps(state) {
  const results = state.getIn(['search', 'searchResults']);
  return {
    searchResults: results,
    groupedResults: results.groupBy(res => res.getIn(['doc', 'source'])),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
  };
}

const ConnectedHOCFind = connect(mapStateToProps, {
  search: actions.main.search,
  request: actions.api.request,
  loadModal: actions.modal.load,
})(HOCFind);
export default ConnectedHOCFind;
