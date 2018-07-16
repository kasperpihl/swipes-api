import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { connect } from 'react-redux';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import * as mainActions from 'src/redux/main/mainActions';
import * as linkActions from 'src/redux/link/linkActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import editorStateToPlainMention from 'src/utils/draft-js/editorStateToPlainMention';
import {
  setupLoading,
  navForContext,
  typeForId
} from 'swipes-core-js/classes/utils';
import convertObjectKeysToUnderscore from 'swipes-core-js/utils/convertObjectKeysToUnderscore';
import getDeep from 'swipes-core-js/utils/getDeep';
import throttle from 'swipes-core-js/utils/throttle';

import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './DiscussionComposer.swiss';

@navWrapper
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  openSecondary: navigationActions.openSecondary,
  contextMenu: mainActions.contextMenu,
  preview: linkActions.preview,
  createPost: ca.posts.create,
})

export default class DiscussionComposer extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);

    const savedState = props.savedState && props.savedState.get('post');

    this.state = {
      post: savedState || fromJS({
        message: props.message || '',
        taggedUsers: props.taggedUsers || [],
        context: props.context || null,
      }),
    };
    this.throttledSaveState = throttle(this.saveState.bind(this), 500);

    setupLoading(this);
  }
  componentWillUnmount() {
    this.throttledSaveState.clear();
  }
  onContextClose() {
    this.updatePost(this.state.post.set('context', null));
  }
  onFocus = () => {
    const input = getDeep(this, 'refs.create.refs.composer.refs.textarea.refs.textarea');
    if(input) {
      input.focus()
    }
  }
  onAssigningClose(assignees) {
    if(assignees) {
      this.updatePost(this.state.post.set('taggedUsers', assignees));
    }
  }

  onContextClick() {
    const { openSecondary, target } = this.props;
    const { post } = this.state;
    openSecondary(target, navForContext(post.get('context')));
  }

  onPostClick(e) {
    const { createPost, navPop, hideModal } = this.props;
    let { post } = this.state;

    if(!this.editorState) return;

    const message = editorStateToPlainMention(this.editorState);

    if(!message.length) return;

    post = post.set('message', message);
    this.setLoading('post');

    createPost(convertObjectKeysToUnderscore(post.toJS())).then((res) => {
      if (res.ok) {
        this.clearLoading('post', 'Posted', 1500, () => {
          if(hideModal) {
            hideModal();
          } else {
            navPop();
          }
        });
        window.analytics.sendEvent('Post created', {
          'Tagged people': post.get('taggedUsers').size,
          'Attachments': post.get('attachments').size,
          'Context type': post.get('context') ? typeForId(post.getIn(['context', 'id'])) : 'No context',
        });
      } else {
        this.clearLoading('post', '!Error', 3000);
      }
    })
  }
  onMessageChange = (editorState) =>  {
    this.editorState = editorState;
  }
  updatePost(post) {
    this.setState({ post }, () => {
      this.throttledSaveState();
    });
  }
  saveState() {
    const { post } = this.state;
    const { saveState } = this.props;
    saveState({ post });
  }

  renderActionBar() {
    const { post } = this.state;
    const hasAssignees = post.get('taggedUsers') && !!post.get('taggedUsers').size;
    const buttonProps = hasAssignees ? {
      compact: true,
    } : {
      sideLabel: 'Tag',
    };

    return (
      <SW.ActionBar>
        <SW.AssignSection>
          <HOCAssigning
            assignees={post.get('taggedUsers')}
            delegate={this}
            size={24}
            buttonProps={buttonProps}
            maxImages={9}
          />
        </SW.AssignSection>
        <SW.Seperator />
        <SW.PostButton
          title="Post"
          onClick={this.onPostClick}
        />
      </SW.ActionBar>
    )
  }

  render() {
    const { myId, hideModal } = this.props;
    const placeholder = `What topic do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <HOCAssigning
            assignees={[myId]}
            size={36}
          />
          <SW.InputWrapper>
            <AutoCompleteInput
              innerRef={(c) => { this.input = c; }}
              onChange={this.onMessageChange}
              placeholder={placeholder}
              autoFocus
            />
          </SW.InputWrapper>
        </SW.ComposerWrapper>
        {this.renderActionBar()}
      </SW.Wrapper>
    )
  }
}
