import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as a from 'actions';
import { attachments as att } from 'swipes-core-js';
import { setupCachedCallback, setupDelegate, setupLoadingHandlers } from 'classes/utils';
import Icon from 'Icon';
import Attachment from './Attachment';
import './styles/attachments';

class HOCAttachments extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.onPreviewCached = setupCachedCallback(this.onPreview, this);
    this.onFlagClickCached = setupCachedCallback(this.onFlagClick, this);
    this.onDeleteClickCached = setupCachedCallback(this.onDeleteClick, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onAdd = this.onAdd.bind(this);
    setupLoadingHandlers(this);
  }
  componentWillUnmount() {
    clearTimeout(this._timer);
    this._unmounted = true;
  }
  onPreview(id) {
    const {
      previewLink,
      attachments,
    } = this.props;
    previewLink(this.context.target, attachments.get(id));
  }

  onFlagClick(id) {
    this.callDelegate('onFlag', id);
  }
  onDeleteClick(id, e) {
    const {
      confirm,
      targetId,
      removeAttachment,
    } = this.props;

    confirm({
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
      title: 'Remove Attachment?',
      message: 'Are you sure you want to remove this attachment?',
    }, (res) => {
      if (res === 1) {
        removeAttachment(targetId, id);
      }
    });
  }
  onAdd(which, e) {
    const {
      inputMenu,
      targetId,
      createNote,
      openFind,
    } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
      buttonLabel: 'Add',
    };
    if (which === 'find') {
      openFind(this.context.target, targetId);
      return;
    }
    if (which === 'url') {
      options.placeholder = 'Enter a URL';
    } else if (which === 'note') {
      options.placeholder = 'Enter a URL';
    }
    inputMenu(options, (title) => {
      if (title && title.length) {
        this.setLoadingState('adding');
        if (which === 'url') {
          this.attachToTarget(which, title, title);
        } else {
          createNote().then((res) => {
            if (res && res.ok) {
              this.attachToTarget(which, res.note.id, title);
            } else {
              this.clearLoadingState('adding');
            }
          });
        }
      }
    });
  }
  getSwipesLinkObj(type, id, title) {
    const { myId } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id,
      },
      permission: {
        account_id: myId,
      },
      meta: {
        title,
      },
    };
  }
  attachToTarget(type, id, title) {
    const linkObj = this.getSwipesLinkObj(type, id, title);
    const { targetId, addAttachment } = this.props;
    addAttachment(targetId, linkObj).then(() => {
      this.clearLoadingState('adding');
    });
  }
  getIconForService(service) {
    switch (service.get('type')) {
      case 'url':
        return 'Hyperlink';
      case 'note':
        return 'Note';
      default:
        return 'Hyperlink';
    }
  }
  renderEmpty() {
    return <div className="attachments__empty">No attachments yet</div>;
  }

  renderAttachments() {
    const {
      attachments,
      attachmentOrder: aOrder,
      flags,
    } = this.props;
    const enableFlagging = !!flags;

    if (!aOrder.size) {
      return this.renderEmpty();
    }
    return aOrder.map((aId) => {
      const at = attachments.get(aId);
      // K_TODO: Backward compatibility remove "|| at" and "|| at.get('title')"
      const icon = this.getIconForService(at.getIn(['link', 'service']) || at);
      const title = at.getIn(['link', 'meta', 'title']) || at.get('title');
      return (
        <Attachment
          key={aId}
          flagged={(enableFlagging && flags.indexOf(aId) !== -1)}
          onFlag={this.onFlagClickCached(aId)}
          onDelete={this.onDeleteClickCached(aId)}
          onClick={this.onPreviewCached(aId)}

          icon={icon}
          title={title}
          enableFlagging={enableFlagging}
        />
      );
    });
  }
  renderAddAttachments() {
    let className = 'attachments__add-list';

    if (this.getLoadingState('adding').loading) {
      className += ' attachments__add-list--loading';
    }

    return (
      <div className={className}>
        <div className="attachments__add-icon">
          <Icon icon="Plus" className="attachments__svg" />
        </div>
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

const { func, object, string } = PropTypes;
HOCAttachments.propTypes = {
  createNote: func,
  addAttachment: func,
  removeAttachment: func,
  attachmentOrder: list,
  attachments: map,
  targetId: string,
  delegate: object,
  inputMenu: func,
  myId: string,
  flags: list,
  openFind: func,
  confirm: func,
  previewLink: func,
};
HOCAttachments.contextTypes = {
  target: string,
};

function mapStateToProps(state) {
  return {
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  addAttachment: att.add,
  removeAttachment: att.remove,
  createNote: a.notes.create,
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
  openFind: a.links.openFind,
  previewLink: a.links.preview,
})(HOCAttachments);
