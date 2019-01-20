import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import UserImage from 'src/react/components/UserImage/UserImage';
import * as linkActions from 'src/redux/link/linkActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import request from 'swipes-core-js/utils/request';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';
import {
  setupLoading,
  miniIconForId,
  attachmentIconForService,
  navForContext,
  typeForId
} from 'swipes-core-js/classes/utils';
import throttle from 'swipes-core-js/utils/throttle';
import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import AttachButton from 'src/react/components/attach-button/AttachButton';
import Attachment from 'src/react/components/attachment/Attachment';
import SW from './DiscussionComposer.swiss';

@navWrapper
@connect(
  state => ({
    myId: state.me.get('id'),
    orgId: state.me.getIn(['organizations', 0, 'id'])
  }),
  {
    openSecondary: navigationActions.openSecondary,
    preview: linkActions.preview
  }
)
class DiscussionComposer extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);

    const savedState = props.savedState && props.savedState.get('discussion');

    this.state = {
      topicValue: '',
      discussion:
        savedState ||
        fromJS({
          taggedUsers: props.taggedUsers || [],
          context: props.context || null,
          attachments: props.attachments || []
        })
    };
    this.throttledSaveState = throttle(this.saveState.bind(this), 500);

    setupLoading(this);
  }
  componentWillUnmount() {
    this.throttledSaveState.clear();
  }
  onContextClose() {
    this.updatePost(this.state.discussion.set('context', null));
  }
  onContextClick() {
    const { openSecondary, target } = this.props;
    const { discussion } = this.state;
    openSecondary(target, navForContext(discussion.get('context')));
  }
  onAttachmentClick = i => {
    const { preview, target } = this.props;
    const { discussion } = this.state;
    preview(target, discussion.getIn(['attachments', i]));
  };
  onAttachmentClose(i) {
    this.updatePost(
      this.state.discussion.updateIn(['attachments'], atts => atts.delete(i))
    );
  }
  onAssigningClose(assignees) {
    if (assignees) {
      this.updatePost(this.state.discussion.set('taggedUsers', assignees));
    }
  }
  onAttachButtonCloseOverlay() {
    this.input.focus();
  }
  onAddedAttachment(att) {
    const { discussion } = this.state;
    this.updatePost(
      discussion.updateIn(['attachments'], atts => atts.push(att))
    );
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center'
    };
  }
  onPostSubmit = () => {
    const { orgId, hideModal } = this.props;
    const { discussion, topicValue } = this.state;
    const message = editorStateToPlainMention(this.editorState);

    if (!message) {
      return;
    }
    this.setLoading('discussion', 'Creating');
    request('discussion.add', {
      message,
      context: this.state.discussion.toJS().context,
      organization_id: orgId,
      topic: topicValue,
      privacy: 'public',
      followers: this.state.discussion.toJS().taggedUsers,
      attachments: this.state.discussion.toJS().attachments
    }).then(res => {
      if (res.ok) {
        const { openSecondary, target } = this.props;
        hideModal();
        openSecondary(
          target,
          navForContext(fromJS({ id: res.updates[0].data.id }))
        );
        window.analytics.sendEvent('Discussion created', {
          'Tagged people': discussion.get('taggedUsers').size,
          'Context type': discussion.get('context')
            ? typeForId(discussion.getIn(['context', 'id']))
            : 'No context'
        });
      } else {
        this.clearLoading('discussion', '!Error', 3000);
      }
    });
  };
  onMessageChange = editorState => {
    this.editorState = editorState;
  };
  onTopicChange = e => {
    this.setState({
      topicValue: e.target.value
    });
  };
  updatePost(discussion) {
    this.setState({ discussion }, () => {
      this.throttledSaveState();
    });
  }
  saveState() {
    const { discussion } = this.state;
    const { saveState } = this.props;
    saveState({ discussion });
  }
  renderAttachments() {
    const { discussion } = this.state;
    if (!discussion.get('attachments').size) {
      return undefined;
    }

    return discussion.get('attachments').map((att, i) => {
      const icon = attachmentIconForService(att.getIn(['link', 'service']));
      return (
        <Attachment
          title={att.get('title')}
          key={i}
          onClick={() => this.onAttachmentClick(i)}
          onClose={() => this.onAttachmentClose(i)}
          icon={icon}
        />
      );
    });
  }
  renderContext() {
    const { discussion } = this.state;
    if (!discussion.get('context')) {
      return undefined;
    }

    return (
      <Attachment
        icon={miniIconForId(discussion.getIn(['context', 'id']))}
        title={discussion.getIn(['context', 'title'])}
        onClick={this.onContextClick}
        isContext
      />
    );
  }
  renderActionBar() {
    const { discussion } = this.state;
    const hasAssignees =
      discussion.get('taggedUsers') && !!discussion.get('taggedUsers').size;
    const hasAttachments =
      discussion.get('context') || discussion.get('attachments').size;
    const buttonProps = hasAssignees
      ? {
          compact: true
        }
      : {
          sideLabel: 'Tag'
        };

    return (
      <SW.ActionBar>
        <SW.AssignSection>
          <HOCAssigning
            assignees={discussion.get('taggedUsers')}
            delegate={this}
            size={24}
            buttonProps={buttonProps}
            maxImages={9}
          />
        </SW.AssignSection>
        <SW.Seperator />
        <SW.AttachSection notEmpty={hasAttachments}>
          {this.renderContext()}
          {this.renderAttachments()}
          <AttachButton
            delegate={this}
            buttonProps={{
              sideLabel: !hasAttachments && 'Attach',
              compact: hasAttachments
            }}
            dropTitle={'New Post'}
          />
        </SW.AttachSection>
        <SW.PostButton
          title="Post"
          onClick={this.onPostSubmit}
          {...this.getLoading('discussion')}
        />
      </SW.ActionBar>
    );
  }

  render() {
    const { myId } = this.props;
    const { topicValue } = this.state;
    const topicPlaceholder = 'Topic';
    const placeholder = 'Message';

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <UserImage userId="me" size={36} />
          <SW.InputWrapper>
            <SW.Input
              value={topicValue}
              onChange={this.onTopicChange}
              placeholder={topicPlaceholder}
              type="text"
              autoFocus
            />
            <AutoCompleteInput
              innerRef={c => {
                this.input = c;
              }}
              onChange={this.onMessageChange}
              placeholder={placeholder}
            />
          </SW.InputWrapper>
        </SW.ComposerWrapper>
        {this.renderActionBar()}
      </SW.Wrapper>
    );
  }
}

export default DiscussionComposer;
