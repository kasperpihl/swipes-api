import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Browse from './Browse';

class HOCBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cache: {

      },
      paths: [],
    };
  }
  componentDidMount() {
    this.loadPath('', 'Dropbox');
  }
  updateCacheAtPath(path, result) {
    const { cache } = this.state;
    cache[`${path}`] = result;
    console.log(path, result, cache);
    this.setState({ cache });
  }
  loadPath(path, title) {
    const { accountId, request } = this.props;
    const { paths } = this.state;
    paths.push({ path, title });
    this.setState({ paths });
    request('services.request', {
      service_name: 'dropbox',
      account_id: accountId,
      data: {
        method: 'files.listFolder',
        parameters: {
          path,
        },
      },
    }).then((res) => {
      if (res && res.ok && res.data) {
        this.updateCacheAtPath(path, this.mapResults(res.data.entries));
      }
    });
  }
  clickedEntry(entry) {
    if (entry.type === 'folder') {
      this.loadPath(entry.path, entry.title);
    } else {
      this.preview(entry);
    }
  }
  clickedBack() {
    const { paths } = this.state;
    paths.pop();
    this.setState({ paths });
  }
  preview(entry) {
    const { loadModal, request, accountId } = this.props;
    loadModal('preview', {
      loading: true,
    });
    request('services.request', {
      service_name: 'dropbox',
      account_id: accountId,
      data: {
        method: 'files.getTemporaryLink',
        parameters: {
          path: `rev:${entry.id}`,
        },
      },
    }).then((res) => {
      if (res && res.data && res.data.link) {
        console.log(res.data);
        const dropboxFolder = localStorage.getItem('dropbox-folder');
        const fullFilePath = dropboxFolder + res.data.metadata.path_display;
        const type = 'application/pdf';
        const link = res.data.link;
        const buttons = [];
        const newData = {
          type: null,
          title: entry.title,
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
            const url = `https://www.dropbox.com/home${entry.path}`;
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
  mapResults(entries) {
    return entries.map(ent => ({
      title: ent.name,
      path: ent.path_lower,
      path_display: ent.path_display,
      type: ent['.tag'],
      id: ent.rev,
    }));
  }
  render() {
    const {
      paths,
      cache,
    } = this.state;
    const entry = paths[paths.length - 1];
    const title = entry ? entry.title : 'Loading...';
    const path = entry ? entry.path : undefined;
    return (
      <Browse
        title={title}
        showBack={(paths.length > 1)}
        result={cache[`${path}`]}
        delegate={this}
      />
    );
  }
}

const { string, object, func } = PropTypes;
HOCBrowse.propTypes = {
  title: string,
  accountId: string,
  request: func,
  result: object,
};

function mapStateToProps(state) {
  const accountId = state.getIn(['me', 'services']).find(s => s.get('service_name') === 'dropbox').get('id');
  return {
    accountId,
  };
}

export default connect(mapStateToProps, {
  request: actions.api.request,
  loadModal: actions.modal.load,
})(HOCBrowse);
