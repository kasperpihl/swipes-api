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
    this.onIconClickCached = setupCachedCallback(this.onIconClick, this);
    this.onAddCached = setupCachedCallback(this.onAdd, this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onAdd = this.onAdd.bind(this);
    this.state = { loading: false };
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
    previewLink(attachments.get(id));
  }
  onIconClick(id) {
    const {
      enableFlagging,
      goalId,
      removeFromCollection,
      loadModal,
    } = this.props;
    if (enableFlagging) {
      this.callDelegate('onFlag', id);
    } else {
      loadModal(
        {
          title: 'Archive Goal?',
          data: {
            message: 'Are you sure you want to archive this goal?',
            buttons: ['Yes', 'No'],
          },
          type: 'warning',
        },
        (res) => {
          if (res && res.button === 0) {
            if (goalId) {
              removeFromCollection(goalId, id).then(() => {
              });
            }
            this.callDelegate('onRemoveAttachment', id);
          }
        },
      );
    }
  }
  onAdd(which, e) {
    const {
      addLinkMenu,
      addToCollection,
      addNote,
      addToasty,
      updateToasty,
      addURL,
      goalId,
      showNote,
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
            showNote(obj.id);
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
    const { attachments, attachmentOrder: aOrder, enableFlagging } = this.props;
    let html = <div className="attachments__empty-state">There are no attachments yet.</div>;
    let { flags } = this.props;
    if (!flags) {
      flags = [];
    } else {
      flags = flags.toJS();
    }
    if (this.hasAttachments()) {
      html = aOrder.map((aId) => {
        const a = attachments.get(aId);

        return (
          <Attachment
            key={aId}
            flagged={(flags.indexOf(aId) !== -1)}
            onClickIcon={this.onIconClickCached(aId)}
            onClickText={this.onPreviewCached(aId)}
            icon={a.get('type') === 'note' ? 'Note' : 'Hyperlink'}
            title={a.get('title')}
            enableFlagging={enableFlagging}
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
      let className = ' attachment attachment--add';
      const { loading } = this.state;
      if (loading) {
        className += ' attachment--loading';
      }

      return (
        <div className={className} onClick={this.onAddCached('menu')}>
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

const { func, object, bool, string } = PropTypes;
HOCAttachments.propTypes = {
  addLinkMenu: func,
  addNote: func,
  addToasty: func,
  addToCollection: func,
  addURL: func,
  attachmentOrder: list,
  attachments: map,
  delegate: object,
  disableAdd: bool,
  enableFlagging: bool,
  flags: list,
  goalId: string,
  loadModal: func,
  openFind: func,
  previewLink: func,
  removeFromCollection: func,
  showNote: func,
  updateToasty: func,
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
  loadModal: actions.main.modal,
  openFind: actions.links.openFind,
  previewLink: actions.links.preview,
  removeFromCollection: actions.goals.removeFromCollection,
  showNote: actions.main.note.show,
  updateToasty: actions.toasty.update,
})(HOCAttachments);
