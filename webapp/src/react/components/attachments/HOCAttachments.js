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
  onAdd(e) {
    const {
      addLinkMenu,
    } = this.props;

    addLinkMenu({
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'right',
    }, (obj) => {
      this.callDelegate('onAddAttachment', obj);
    });
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
    if (this.hasAttachments()) {
      return (
        <div className="attachment attachment--add" onClick={this.onAdd}>
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
        <button className="attachments__add-item">Add URL</button>
        <button className="attachments__add-item">New Note</button>
        <button className="attachments__add-item">Find</button>
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

const { func, object } = PropTypes;
HOCAttachments.propTypes = {
  flags: list,
  attachments: map,
  attachmentOrder: list,
  addLinkMenu: func,
  delegate: object,
  previewLink: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  addLinkMenu: actions.links.addMenu,
  previewLink: actions.links.preview,
})(HOCAttachments);
