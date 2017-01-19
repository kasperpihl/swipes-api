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
    const { searchResults, request, loadModal } = this.props;
    const obj = searchResults.get(i);

    if (obj) {
      const doc = obj.get('doc').toJS();
      console.log('clicked', i, obj.toJS());
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
                icon: 'Desktop',
                title: 'Open on Desktop',
                onClick: () => {
                  window.ipcListener.sendEvent('showItemInFolder', fullFilePath);
                },
              });
            }

            buttons.push({
              icon: 'Earth',
              title: 'Open in Dropbox.com',
              onClick: () => {
                const url = `https://www.dropbox.com/home${doc.filepath}/${doc.filename}`;
                window.ipcListener.sendEvent('openExternal', url);
              },
            }, {
              icon: 'Download',
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
})(HOCFind);
export default ConnectedHOCFind;
