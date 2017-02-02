import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { setupDelegate } from 'classes/utils';
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
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
    this.loadPath({ path: '', title: 'Dropbox' });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.paths.length !== this.state.paths.length) {
      setTimeout(() => {
        const { scroller } = this.refs;
        if (scroller) {
          const scrollW = scroller.scrollWidth;
          const clientW = scroller.clientWidth;
          scroller.scrollLeft = Math.max(scrollW - clientW, 0);
        }
      }, 600);
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  updateCacheAtPath(path, result) {
    const { cache } = this.state;
    cache[`${path}`] = result;
    if (!this._unmounted) {
      this.setState({ cache });
    }
  }
  loadPath(entry, depth) {
    const { title, path } = entry;
    const { accountId, request } = this.props;
    let { paths, selectedItemIds } = this.state;
    if (typeof depth === 'number') {
      const size = this.state.paths.length;
      if (depth < (size - 1)) {
        paths = paths.slice(0, depth + 1);
        selectedItemIds = selectedItemIds.slice(0, depth);
      }
    }
    if (entry.id) {
      selectedItemIds = selectedItemIds.concat([entry.id]);
    }
    paths = paths.concat([{ path, title }]);
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
      const { accountId } = this.props;
      const link = {
        service: {
          id: `rev:${entry.id}`,
          name: 'dropbox',
          type: 'file',
        },
        permission: {
          account_id: accountId,
        },
        meta: {
          title: entry.title,
        },
      };
      this.callDelegate('onPreviewLink', link);
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
      leftIcon: (ent['.tag'] === 'folder' ? 'Folder' : undefined),
      rightIcon: (ent['.tag'] === 'folder' ? 'ArrowRightLine' : undefined),
    }));
  }
  renderSidebarSection() {
    const props = {
      selectedItemId: 'dropbox',
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
      return <BrowseSectionList key={i} {...props} />;
    });
  }
  render() {
    return (
      <div className="browse-container">
        <div className="browse-sidebar">
          {this.renderSidebarSection()}
        </div>
        <div className="browse-horizontal-scroller" ref="scroller">
          {this.renderHorizontalSections()}
        </div>
      </div>
    );
  }
}

const { string, func, object } = PropTypes;
HOCBrowse.propTypes = {
  accountId: string,
  request: func,
  delegate: object,
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
