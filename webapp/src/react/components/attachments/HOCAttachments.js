import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

import Button from 'Button';
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
  onOpen(id) {
    const {
      previewLink,
      attachments,
    } = this.props;

    previewLink(attachments.get(id));
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
            onClick={this.onOpenCached(aId)}
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
        <Button
          icon="Plus"
          onClick={this.onAdd}
          className="attachments__add"
        />
      );
    } else {
      return (
        <div className="attachments__add-list">
          <button className="attachments__add-item">Add URL</button>
          <button className="attachments__add-item">New Note</button>
          <button className="attachments__add-item">Find</button>
        </div>
      );
    }
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
