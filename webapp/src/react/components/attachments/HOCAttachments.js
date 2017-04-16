import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';
import {
  setupCachedCallback,
  setupDelegate,
  setupLoading,
  attachmentIconForService,
  bindAll,
} from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import Attachment from './Attachment';
import './styles/attachments';

class HOCAttachments extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = { fileVal: '' };
    this.onPreviewCached = setupCachedCallback(this.onPreview, this);
    this.onFlagClickCached = setupCachedCallback(this.onFlagClick, this);
    this.onContextMenuCached = setupCachedCallback(this.onContextMenu, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    setupDelegate(this);
    bindAll(this, ['onChangeFiles', 'onPaste']);
    setupLoading(this);
  }
  componentDidMount() {
    document.addEventListener('paste', this.onPaste);
  }
  componentWillUnmount() {
    clearTimeout(this._timer);
    this._unmounted = true;
    document.removeEventListener('paste', this.onPaste);
  }

  onPreview(id, e) {
    const {
      previewLink,
      attachments,
    } = this.props;
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      this.callDelegate('willOpenPreview', attachments.get(id), e);
      previewLink(this.context.target, attachments.get(id));
      window.analytics.sendEvent('Attachment opened', {
        Type: attachments.getIn([id, 'link', 'service', 'type']),
        Service: attachments.getIn([id, 'link', 'service', 'name']),
      });
    }
  }

  onFlagClick(id) {
    this.callDelegate('onFlag', id);
  }
  onContextMenu(id, e) {
    const { contextMenu, attachments } = this.props;
    const at = attachments.get(id);
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
  onPaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let uploaded;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const ts = moment().format('MMMM Do YYYY, h:mm:ss a');
        blob.name = `Screenshot from (${ts}).png`;
        this.onUploadFiles([blob]);
        console.log(blob.name, blob.type);
        break;
      }
    }
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
        renameAttachment(targetId, id, title).then((res) => {
          this.clearLoading(id);
          if (res.ok) {
            window.analytics.sendEvent('Attachment renamed', {});
          }
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
        removeAttachment(targetId, id).then((res) => {
          this.clearLoading(id);
          if (res.ok) {
            window.analytics.sendEvent('Attachment removed', {

            });
          }
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
      options.placeholder = 'Title of the note';
    }
    inputMenu(options, (title) => {
      if (title && title.length) {
        this.setLoading('adding');
        if (which === 'url') {
          this.attachToTarget(which, title, title);
        } else {
          createNote(convertToRaw(EditorState.createEmpty().getCurrentContent())).then((res) => {
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
  onUploadFiles(files) {
    const { uploadFiles, targetId } = this.props;
    this.setLoading('adding');
    uploadFiles(targetId, files).then((res) => {
      if (res.ok) {
        this.clearLoading('adding');
        this.setState({ fileVal: '' });
      } else {
        this.clearLoading('adding', '!Something went wrong');
      }
    });
  }
  onChangeFiles(e) {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  }
  attachToTarget(type, id, title) {
    const linkObj = this.getSwipesLinkObj(type, id, title);
    const { targetId, addAttachment } = this.props;
    addAttachment(targetId, linkObj).then((res) => {
      this.clearLoading('adding');
      if (res.ok) {
        window.analytics.sendEvent('Attachment added', {
          Type: type,
          Service: 'swipes',
        });
      }
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
    const { fileVal } = this.state;

    return (
      <div className={className}>
        <button
          className="attachments__add-item"
          onClick={this.onAddCached('url')}
        >
          Add URL
        </button>
        <button
          className="attachments__add-item"
          onClick={this.onAddCached('note')}
        >
          New Note
        </button>
        <label className="attachments__add-item">
          Upload
          <input value={fileVal} type="file" onChange={this.onChangeFiles} />
        </label>
        <div className="attachments__loader" />
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
  addAttachment: ca.attachments.add,
  removeAttachment: ca.attachments.remove,
  renameAttachment: ca.attachments.rename,
  contextMenu: a.main.contextMenu,
  createNote: ca.notes.create,
  uploadFiles: ca.files.upload,
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
  openFind: a.links.openFind,
  previewLink: a.links.preview,
})(HOCAttachments);
