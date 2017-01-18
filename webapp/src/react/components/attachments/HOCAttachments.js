import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
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
  componentDidMount() {
  }
  onOpen(i) {
    const {
      previewLink,
      attachments,
    } = this.props;
    console.log(attachments.get(i));
    previewLink(attachments.get(i));
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
  renderAttachments() {
    const { attachments } = this.props;
    let html = <div className="attachments__empty-state">Nothing here yet</div>;
    if (attachments && attachments.size) {
      html = attachments.map((a, i) => (
        <Attachment
          key={i}
          onClick={this.onOpenCached(i)}
          icon={a.get('type') === 'note' ? 'Note' : 'Hyperlink'}
          title={a.get('title')}
        />
      ));
    }
    return html;
  }
  render() {
    return (
      <div className="attachments">
        {this.renderAttachments()}
        <Button
          icon="Plus"
          onClick={this.onAdd}
          className="attachments__add"
        />
      </div>
    );
  }
}

const { func, object } = PropTypes;
HOCAttachments.propTypes = {
  attachments: list,
  addLinkMenu: func,
  delegate: object,
  previewLink: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  addLinkMenu: actions.links.addMenu,
  previewLink: actions.links.click,
})(HOCAttachments);
