import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import { List } from 'immutable';
import * as actions from 'actions';
import { setupCachedCallback, setupDelegate } from 'classes/utils';
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
    this.state = {
      loading: false,
    };
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
      goalId,
      removeFromCollection,
      confirm,
    } = this.props;

    confirm({
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
      title: 'Remove Attachment?',
      message: 'Are you sure you want to remove this attachment?',
    }, (res) => {
      if (res === 1) {
        if (goalId) {
          removeFromCollection(goalId, id).then(() => {
            window.analytics.sendEvent('Removed attachment');
          });
        }
        this.callDelegate('onRemoveAttachment', id);
      }
    });
  }
  onAdd(which, e) {
    const {
      addToCollection,
      addNote,
      addToasty,
      updateToasty,
      addURL,
      goalId,
      openSecondary,
      openFind,
    } = this.props;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
      goalId,
    };
    let toastId;
    const callback = (progress, type, obj) => {
      if (progress === 'start') {
        if (!this._unmounted) {
          this.setState({ loading: true });
        }
        if (type === 'find') {
          addToasty({ title: 'Adding Attachment', loading: true }).then((tId) => {
            toastId = tId;
          });
        }
      }
      if (progress === 'ready') {
        const succCB = () => {
          if (!this._unmounted) {
            this.setState({ loading: false });
          }
          if (type === 'find' && toastId) {
            updateToasty(toastId, { title: 'Added Attachment', completed: true, duration: 3000 });
          }
          if (type === 'note' && obj.id) {
            openSecondary(this.context.target, {
              id: 'SideNote',
              title: 'Note',
              props: {
                id: obj.id,
              },
            });
          }
        };
        if (goalId) {
          addToCollection(goalId, obj).then(() => {
            succCB();
          });
        } else {
          succCB();
          this.callDelegate('onAddAttachment', obj);
        }
        window.analytics.sendEvent('Added attachment', {
          Type: type,
        });
      }
      if (progress === 'error') {
        if (!this._unmounted) {
          this.setState({ loading: false });
        }
        if (type === 'find' && toastId) {
          updateToasty(toastId, { title: 'Error adding attachment', loading: false, duration: 3000 });
        }
      }
    };

    switch (which) {
      case 'url':
        return addURL(options, callback);
      case 'note':
        return addNote(options, callback);
      case 'find':
        return openFind(this.context.target, callback);
      default:
        return undefined;
    }
  }
  renderEmpty() {
    return <div className="attachments__empty">No attachments yet</div>;
  }
  renderAttachments() {
    const {
      attachments,
      attachmentOrder: aOrder,
      enableFlagging,
      flags = List(),
    } = this.props;

    if (!aOrder.size) {
      return this.renderEmpty();
    }
    return aOrder.map((aId) => {
      const a = attachments.get(aId);
      return (
        <Attachment
          key={aId}
          flagged={(flags.indexOf(aId) !== -1)}
          onFlag={this.onFlagClickCached(aId)}
          onDelete={this.onDeleteClickCached(aId)}
          onClick={this.onPreviewCached(aId)}
          icon={a.get('type') === 'note' ? 'Note' : 'Hyperlink'}
          title={a.get('title')}
          enableFlagging={enableFlagging}
        />
      );
    });
  }
  renderAddAttachments() {
    const { loading } = this.state;

    let className = 'attachments__add-list';

    if (loading) {
      className += ' attachments__add-list--loading';
    }

    return (
      <div className={className}>
        <div className="attachments__add-icon">
          <Icon svg="Plus" className="attachments__svg" />
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

const { func, object, bool, string } = PropTypes;
HOCAttachments.propTypes = {
  addNote: func,
  addToasty: func,
  addToCollection: func,
  addURL: func,
  attachmentOrder: list,
  attachments: map,
  delegate: object,
  enableFlagging: bool,
  flags: list,
  goalId: string,
  openFind: func,
  openSecondary: func,
  confirm: func,
  previewLink: func,
  removeFromCollection: func,
  updateToasty: func,
};
HOCAttachments.contextTypes = {
  target: string,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  addLinkMenu: actions.links.addMenu,
  addNote: actions.links.addNote,
  addToasty: actions.toasty.add,
  addToCollection: actions.goals.addToCollection,
  addURL: actions.links.addURL,
  confirm: actions.menus.confirm,
  openFind: actions.links.openFind,
  previewLink: actions.links.preview,
  removeFromCollection: actions.goals.removeFromCollection,
  openSecondary: actions.navigation.openSecondary,
  updateToasty: actions.toasty.update,
})(HOCAttachments);
