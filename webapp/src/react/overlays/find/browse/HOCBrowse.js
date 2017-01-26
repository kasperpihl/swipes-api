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
  clickedEntry(entry) {
    if (entry.type === 'folder') {
      this.loadPath(entry.path, entry.title);
    } else {
      console.log('wire up preview', entry);
      // this.preview(entry);
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
      id: ent.rev,
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
      <div className="browse-container">
        <div className="browse-sidebar">
          {this.renderSidebarSection()}
        </div>
        <div className="browse-horizontal-scroller">
          {this.renderHorizontalSections()}
        </div>
        {/* <Browse
          title={title}
          showBack={(paths.length > 1)}
          result={cache[`${path}`]}
          delegate={this}
        />*/}
      </div>
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
