import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { attachmentIconForService } from 'swipes-core-js/classes/utils';

import * as ca from 'swipes-core-js/actions';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as linkActions from 'src/redux/link/linkActions';

import navWrapper from 'src/react/app/view-controller/NavWrapper';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';

import SW from './GoalAttachment.swiss';

@navWrapper
@connect(null, {
  removeAttachment: ca.attachments.remove,
  renameAttachment: ca.attachments.rename,
  contextMenu: mainActions.contextMenu,
  inputMenu: menuActions.input,
  confirm: menuActions.confirm,
  previewLink: linkActions.preview,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onPreview = (e) => {
    const {
      previewLink,
      attachment,
      target,
    } = this.props;
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      previewLink(target, attachment);
      window.analytics.sendEvent('Attachment opened', {
        Type: attachment.getIn(['link', 'service', 'type']),
        Service: attachment.getIn(['link', 'service', 'name']),
      });
    }
  }
  onRename(id, currTitle, options) {
    const { goalId, inputMenu, renameAttachment } = this.props;
    inputMenu({
      ...options,
      text: currTitle,
      buttonLabel: 'Rename',
    }, (title) => {
      if (title !== currTitle && title.length) {
        this.setState({ tempTitle: title });
        renameAttachment(goalId, id, title).then((res) => {
          this.setState({ tempTitle: null });
          if (res.ok) {
            window.analytics.sendEvent('Attachment renamed');
          }
        });
      }
    });
  }
  onDelete(id, options) {
    const {
      confirm,
      goalId,
      removeAttachment,
    } = this.props;

    confirm({
      ...options,
      title: 'Remove Attachment?',
      message: 'Are you sure you want to remove this attachment?',
    }, (res) => {
      if (res === 1) {
        this.setState({ deleted: true });
        removeAttachment(goalId, id).then((res) => {
          if (res.ok) {
            window.analytics.sendEvent('Attachment removed');
          }
        });
      }
    });
  }
  onContextMenu = (e) => {
    const {
      contextMenu,
      attachment,
      id,
    } = this.props;
    e.stopPropagation();
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'center',
    };

    console.log(attachment.toJS());
    const items = [{ title: 'Rename' }, { title: 'Remove' }];
    const delegate = {
      onItemAction: (item) => {
        if (item.title === 'Rename') {
          this.onRename(id, attachment.get('title'), options);
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
  render() {
    const { deleted, tempTitle } = this.state;
    if(deleted) {
      return null;
    }

    const { attachment: at } = this.props;
    if(!at) {
      return null;
    }

    const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);
    return (
      <SW.Wrapper onClick={this.onPreview} className="right-button-hover">
        <SW.LeftIcon icon={icon} />
        <SW.Title>{tempTitle || at.get('title')}</SW.Title>
        <SW.RightButton
          icon="ThreeDots"
          onClick={this.onContextMenu}
          compact
        />
      </SW.Wrapper>
    );
  }
}
