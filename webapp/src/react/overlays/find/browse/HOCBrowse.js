import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Browse from './Browse';
import BrowseSectionList from './BrowseSectionList';

import './styles/browse.scss';

class HOCBrowse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cache: {

      },
      paths: [],
      selectedItemIds: [],
    };
  }
  componentDidMount() {
    this.loadPath({ path: '', title: 'Dropbox' });
  }
  updateCacheAtPath(path, result) {
    const { cache } = this.state;
    cache[`${path}`] = result;
    console.log(path, result, cache);
    this.setState({ cache });
  }
  loadPath(entry, depth) {
    const { title, path } = entry;
    const { accountId, request } = this.props;
    const { paths, selectedItemIds } = this.state;
    if (typeof depth === 'number') {
      const size = this.state.paths.length;
      if (depth < (size - 1)) {
        paths.splice(depth + 1);
        selectedItemIds.splice(depth);
      }
    }
    if (entry.id) {
      selectedItemIds.push(entry.id);
    }
    paths.push({ path, title });
    this.setState({ paths, selectedItemIds });
    request('services.request', {
      service_name: 'dropbox',
      account_id: accountId,
      method: 'files.listFolder',
      parameters: {
        path,
      },
    }).then((res) => {
      if (res && res.ok && res.result) {
        this.updateCacheAtPath(path, this.mapResults(res.result.entries));
      }
    });
  }
  clickedItem(depth, entry) {
    if (entry.type === 'folder') {
      this.loadPath(entry, depth);
    } else {
      console.log('wire up preview', entry);
      // this.preview(entry);
      const { accountId, preview } = this.props;
      const link = {
        service: {
          id: `rev:${entry.id}`,
          name: 'dropbox',
          type: 'file',
        },
        permission: {
          account_id: accountId,
        },
      };
      preview(link);
    }
  }
  clickedBack() {
    const { paths } = this.state;
    paths.pop();
    this.setState({ paths });
  }
  mapResults(entries) {
    return entries.map(ent => ({
      title: ent.name,
      path: ent.path_lower,
      path_display: ent.path_display,
      type: ent['.tag'],
      id: ent.rev || ent.path_lower,
    }));
  }
  renderSidebarSection() {
    const props = {
      delegate: this,
      sections: [{
        title: 'Services',
        items: [
          { id: 'dropbox', title: 'Dropbox' },
          { id: 'evernote', title: 'Evernote' },
          { id: 'box', title: 'Box' },
          { id: 'slack', title: 'Slack' },
          { id: 'Invision', title: 'Invision' },
          { id: 'notes', title: 'Swipes Notes' },
        ],
      }, {
        title: 'Shortcuts',
        items: [
          { title: 'Brand Guidelines', leftIcon: 'Note' },
          { title: 'Design notes', leftIcon: 'Note' },
          { title: 'Production', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { title: 'Prototype', leftIcon: 'Person', rightIcon: 'ArrowRightLine' },
          { title: 'creative', leftIcon: 'SlackLogo', rightIcon: 'ArrowRightLine' },
          { title: 'general', leftIcon: 'SlackLogo', rightIcon: 'ArrowRightLine' },
          { title: 'Kasper', leftIcon: 'Person' },
          { title: 'Journal', leftIcon: 'Note' },
        ],
      }],
    };
    return <BrowseSectionList {...props} />;
  }
  renderHorizontalSections() {
    const {
      paths,
      selectedItemIds,
      cache,
    } = this.state;
    return paths.map((p, i) => {
      const section = {
        title: p.title,
      };
      const c = cache[p.path];
      if (c) {
        section.loading = false;
        section.items = c;
      }
      const props = {
        depth: i,
        delegate: this,
        selectedItemId: selectedItemIds[i],
        loading: !section.items,
        sections: [section],
      };
      return <BrowseSectionList {...props} />;
    });
  }
  render() {
    return (
      <div className="browse-container">
        <div className="browse-sidebar">
          {this.renderSidebarSection()}
        </div>
        <div className="browse-horizontal-scroller">
          {this.renderHorizontalSections()}
        </div>
      </div>
    );
  }
}

const { string, func } = PropTypes;
HOCBrowse.propTypes = {
  accountId: string,
  request: func,
};

function mapStateToProps(state) {
  const accountId = state.getIn(['me', 'services']).find(s => s.get('service_name') === 'dropbox').get('id');
  return {
    accountId,
  };
}

export default connect(mapStateToProps, {
  request: actions.api.request,
  preview: actions.main.preview,
})(HOCBrowse);
