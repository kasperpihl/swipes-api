import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { setupCachedCallback, setupDelegate } from 'classes/utils';
import Icon from 'Icon';
import Attachment from './Attachment';
import './styles/attachments';

class HOCAttachments extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onPreviewCached = setupCachedCallback(this.onPreview, this);
    this.onFlagCached = setupCachedCallback(this.onFlag, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onAdd = this.onAdd.bind(this);
    this.state = { flags: [] };
  }
  onPreview(id) {
    const {
      previewLink,
      attachments,
    } = this.props;
    previewLink(attachments.get(id));
  }
  onFlag(id) {
    let flags = this.state.flags;
    const index = flags.indexOf(id);
    if (index !== -1) {
      flags = flags.slice(0, index).concat(flags.slice(index + 1));
    } else {
      flags = flags.concat([id]);
    }
    this.setState({ flags });
  }
  onAdd(which, e) {
    const {
      addLinkMenu,
      addNote,
      addURL,
      openFind,
    } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
    };
    const callback = (obj) => {
      this.callDelegate('onAddAttachment', obj);
    };

    switch (which) {
      case 'url':
        return addURL(options, callback);
      case 'note':
        return addNote(options, callback);
      case 'find':
        return openFind(callback);
      default: {
        return addLinkMenu(options, callback);
      }
    }
  }
  hasAttachments() {
    const { attachmentOrder } = this.props;
    return (attachmentOrder && attachmentOrder.size);
  }
  renderAttachments() {
    const { attachments, attachmentOrder: aOrder } = this.props;
    let html = <div className="attachments__empty-state">There are no attachments yet.</div>;
    const { flags } = this.state;
    if (this.hasAttachments()) {
      html = aOrder.map((aId) => {
        const a = attachments.get(aId);

        return (
          <Attachment
            key={aId}
            flagged={(flags.indexOf(aId) !== -1)}
            onClickIcon={this.onFlagCached(aId)}
            onClickText={this.onPreviewCached(aId)}
            icon={a.get('type') === 'note' ? 'Note' : 'Hyperlink'}
            title={a.get('title')}
          />
        );
      });
    }

    return html;
  }
  renderAddAttachments() {
    const { disableAdd } = this.props;
    if (disableAdd) {
      return false;
    }
    if (this.hasAttachments()) {
      return (
        <div className="attachment attachment--add attachment--loading" onClick={this.onAddCached('menu')}>
          <div className="attachment__icon">
            <Icon svg="Plus" className="attachment__svg" />
          </div>
          <div className="attachment__title">
            Add more
          </div>
        </div>
      );
    }

    return (
      <div className="attachments__add-list">
        <button
          className="attachments__add-item"
          onClick={this.onAddCached('url')}
        >Add URL</button>
        <button
          className="attachments__add-item"
          onClick={this.onAddCached('note')}
        >New Note</button>
        <button
          className="attachments__add-item"
          onClick={this.onAddCached('find')}
        >Find</button>
      </div>
    );
  }
  render() {
    return (
      <div className="attachments">
        {this.renderAttachments()}
        {this.renderAddAttachments()}
      </div>
    );
  }
}

const { func, object, bool } = PropTypes;
HOCAttachments.propTypes = {
  flags: list,
  attachments: map,
  attachmentOrder: list,
  disableAdd: bool,
  addLinkMenu: func,
  addNote: func,
  addURL: func,
  openFind: func,
  delegate: object,
  previewLink: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  addLinkMenu: actions.links.addMenu,
  addURL: actions.links.addURL,
  openFind: actions.links.openFind,
  addNote: actions.links.addNote,
  previewLink: actions.links.preview,
})(HOCAttachments);
