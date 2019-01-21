import React, { PureComponent } from 'react';
import UserImage from 'src/react/components/UserImage/UserImage';
import { fromJS } from 'immutable';
import request from 'swipes-core-js/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import SW from './DiscussionComposer.swiss';
import { fromJS } from 'immutable';

@withLoader
export default class DiscussionComposer extends PureComponent {
  state = {
    topic: '',
    followers: fromJS([])
  };

  onAssigningClose(followers) {
    if (followers) {
      this.setState({ followers });
    }
  }

  handlePostSubmit = () => {
    const { organizationId, hideModal, loader } = this.props;
    const { followers, topic } = this.state;

    loader.set('discussion', 'Creating');
    request('discussion.add', {
      organization_id: organizationId,
      topic: topic,
      privacy: 'public',
      followers: followers.toJS()
    }).then(res => {
      if (res.ok) {
        hideModal();
        window.analytics.sendEvent('Discussion created', {
          'Tagged people': discussion.get('followers').size
        });
      } else {
        loader.error('discussion', res.error, 3000);
      }
    });
  };
  handleTopicChange = e => {
    this.setState({
      topic: e.target.value
    });
  };
  renderActionBar() {
    const { followers } = this.state;
    const buttonProps = !!followers.size
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
            assignees={followers}
            delegate={this}
            size={24}
            buttonProps={buttonProps}
            maxImages={9}
          />
        </SW.AssignSection>
        <SW.Seperator />
        <SW.PostButton
          title="Post"
          onClick={this.handlePostSubmit}
          {...loader.get('discussion')}
        />
      </SW.ActionBar>
    );
  }

  render() {
    const { topic } = this.state;
    const topicPlaceholder = 'Topic';

    return (
      <SW.Wrapper>
        <SW.ComposerWrapper>
          <UserImage userId="me" size={36} />
          <SW.InputWrapper>
            <SW.Input
              value={topic}
              onChange={this.handleTopicChange}
              placeholder={topicPlaceholder}
              type="text"
              autoFocus
            />
          </SW.InputWrapper>
        </SW.ComposerWrapper>
        {this.renderActionBar()}
      </SW.Wrapper>
    );
  }
}
