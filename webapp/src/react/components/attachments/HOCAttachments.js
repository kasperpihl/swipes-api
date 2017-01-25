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
    this.onOpenCached = setupCachedCallback(this.onOpen, this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onAdd = this.onAdd.bind(this);
  }
  onOpen(id, which) {
    const {
      previewLink,
      attachments,
      flags,
    } = this.props;
    if (which === 'text') {
      previewLink(attachments.get(id));
    } else if (which === 'icon') {

    }
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

    if (this.hasAttachments()) {
      html = aOrder.map((aId) => {
        const a = attachments.get(aId);

        return (
          <Attachment
            key={aId}
            onClickIcon={this.onOpenCached(aId, 'icon')}
            onClickText={this.onOpenCached(aId, 'text')}
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
