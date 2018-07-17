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
  orgId: state.getIn(['me', 'organizations', 0, 'id']),
}), {
  openSecondary: navigationActions.openSecondary,
  request: ca.api.request,
})

export default class DiscussionComposer extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);

    const savedState = props.savedState && props.savedState.get('post');

    this.state = {
      discussion: savedState || fromJS({
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
    this.updatePost(this.state.discussion.set('context', null));
  }
  onAssigningClose(assignees) {
    if(assignees) {
      this.updatePost(this.state.discussion.set('taggedUsers', assignees));
    }
  }
  onContextClick() {
    const { openSecondary, target } = this.props;
    const { discussion } = this.state;
    openSecondary(target, navForContext(discussion.get('context')));
  }

  onPostSubmit = () => {
    const { request, orgId, hideModal, navPop } = this.props;
    const { discussion } = this.state;
    const topic = this.editorState.getCurrentContent().getPlainText();

    if(!topic){
      return;
    }
    this.setLoading('discussion', 'Creating');
    request('discussion.add', {
      context: this.state.discussion.toJS().context,
      organization_id: orgId,
      topic,
      privacy: 'public',
      followers: this.state.discussion.toJS().taggedUsers,
    }).then(res => {
      if(res.ok) {
        this.clearLoading('discussion', 'Posted', 1500, () => {
          if(hideModal) {
            hideModal();
          } else {
            navPop();
          }
        });
        window.analytics.sendEvent('Discussion created', {
          'Tagged people': discussion.get('taggedUsers').size,
          'Context type': discussion.get('context') ? typeForId(discussion.getIn(['context', 'id'])) : 'No context',
        });
      } else {
        this.clearLoading('discussion', '!Error', 3000);
      }
    })
  }

  onMessageChange = (editorState) =>  {
    this.editorState = editorState;
  }
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

  renderActionBar() {
    const { discussion } = this.state;
    const hasAssignees = discussion.get('taggedUsers') && !!discussion.get('taggedUsers').size;
    const buttonProps = hasAssignees ? {
      compact: true,
    } : {
      sideLabel: 'Tag',
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
        <SW.PostButton
          title="Post"
          onClick={this.onPostSubmit}
          {...this.getLoading('discussion')}
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
