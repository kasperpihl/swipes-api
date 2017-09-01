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
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import Attachment from './Attachment';
import './styles/attachments';

class HOCAttachments extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = { fileVal: '' };
    this.onPreviewCached = setupCachedCallback(this.onPreview, this);
    this.onContextMenuCached = setupCachedCallback(this.onContextMenu, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    setupDelegate(this, 'onFlag');
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
      previewLink(this.context.target, attachments.get(id));
      window.analytics.sendEvent('Attachment opened', {
        Type: attachments.getIn([id, 'link', 'service', 'type']),
        Service: attachments.getIn([id, 'link', 'service', 'name']),
      });
    }
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
  onAddedAttachment(att, clearLoading) {
    const { targetId, addAttachment } = this.props;
    addAttachment(targetId, att.get('link').toJS(), att.get('title')).then((res) => {
      clearLoading();
      if (res.ok) {
        window.analytics.sendEvent('Attachment added', {
          Type: att.getIn(['link', 'service', 'type']),
          Service: 'swipes',
        });
      }
    });
    return false;
  }

  renderEmpty() {
    return <div className="attachments__empty">Upload files, create notes or add other work related materials to the goal.</div>;
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
          onFlag={this.onFlagCached(aId)}
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
    return (
      <div className="attachments__add-list">
        <HOCAttachButton
          delegate={this}
          text="Attach"
        />
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
  addAttachment: func,
  removeAttachment: func,
  renameAttachment: func,
  contextMenu: func,
  attachmentOrder: list,
  attachments: map,
  targetId: string,
  delegate: object,
  inputMenu: func,
  flags: list,
  confirm: func,
  previewLink: func,
};
HOCAttachments.contextTypes = {
  target: string,
};

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, {
  addAttachment: ca.attachments.add,
  removeAttachment: ca.attachments.remove,
  renameAttachment: ca.attachments.rename,
  contextMenu: a.main.contextMenu,
  createNote: ca.notes.create,
  inputMenu: a.menus.input,
  confirm: a.menus.confirm,
  previewLink: a.links.preview,
})(HOCAttachments);
