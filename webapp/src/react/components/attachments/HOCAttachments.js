import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as a from 'actions';
import { attachments as att } from 'swipes-core-js';
import {
  setupCachedCallback,
  setupDelegate,
  setupLoading,
  attachmentIconForService,
} from 'classes/utils';
import Icon from 'Icon';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import Attachment from './Attachment';
import './styles/attachments';

class HOCAttachments extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.onPreviewCached = setupCachedCallback(this.onPreview, this);
    this.onFlagClickCached = setupCachedCallback(this.onFlagClick, this);
    this.onContextMenuCached = setupCachedCallback(this.onContextMenu, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onAdd = this.onAdd.bind(this);
    setupLoading(this);
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
    const selection = window.getSelection();

  	if (selection.toString().length === 0) {
    previewLink(this.context.target, attachments.get(id));
  	}
  }

  onFlagClick(id) {
    this.callDelegate('onFlag', id);
  }
  onContextMenu(id, e) {
    const { contextMenu, attachments } = this.props;
    const at = attachments.get(id);
    console.log(id, at.toJS());
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
    };

    const items = [{ title: 'Rename' }, { title: 'Remove' }];
    const delegate = {
      onItemAction: (item) => {
        if (item.title === 'Rename') {
          this.onRename(id, at.get('title'), options);
        } else {
          this.onDelete(id, options);
        }
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
      },
    });
  }
  onRename(id, currTitle, options) {
    const { targetId, inputMenu, renameAttachment } = this.props;
    inputMenu({
      ...options,
      text: currTitle,
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== currTitle && title.length) {
        this.setLoading(id, 'Renaming...');
        renameAttachment(targetId, id, title).then(() => {
          this.clearLoading(id);
        });
      }
    });
  }
  onDelete(id, options) {
    const {
      confirm,
      targetId,
      removeAttachment,
    } = this.props;

    confirm({
      ...options,
      title: 'Remove Attachment?',
      message: 'Are you sure you want to remove this attachment?',
    }, (res) => {
      if (res === 1) {
        this.setLoading(id, 'Removing...');
        removeAttachment(targetId, id).then(() => {
          this.clearLoading(id);
        });
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
        this.setLoading('adding');
        if (which === 'url') {
          this.attachToTarget(which, title, title);
        } else {
          createNote().then((res) => {
            if (res && res.ok) {
              this.attachToTarget(which, res.note.id, title);
            } else {
              this.clearLoading('adding');
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
      this.clearLoading('adding');
    });
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
      // K_TODO: Backward compatibility remove "|| at"
      const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

      return (
        <Attachment
          key={aId}
          flagged={(enableFlagging && flags.indexOf(aId) !== -1)}
          onFlag={this.onFlagClickCached(aId)}
          onContextMenu={this.onContextMenuCached(aId)}
          onClick={this.onPreviewCached(aId)}
          {...this.getLoading(aId)}
          icon={icon}
          title={at.get('title')}
          enableFlagging={enableFlagging}
        />
      );
    });
  }
  renderAddAttachments() {
    let className = 'attachments__add-list';

    if (this.getLoading('adding').loading) {
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
        {this.renderAddAttachments()}
        {this.renderAttachments()}

      </div>
    );
  }
}

const { func, object, string } = PropTypes;
HOCAttachments.propTypes = {
  createNote: func,
  addAttachment: func,
  removeAttachment: func,
  renameAttachment: func,
  contextMenu: func,
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
  renameAttachment: att.rename,
  contextMenu: a.main.contextMenu,
  createNote: a.notes.create,
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
  openFind: a.links.openFind,
  previewLink: a.links.preview,
})(HOCAttachments);
