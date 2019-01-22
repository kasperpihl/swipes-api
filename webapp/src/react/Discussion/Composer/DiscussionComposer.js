import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import request from 'swipes-core-js/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import OrgPicker from 'src/react/_components/OrgPicker/OrgPicker';
import Assignees from 'src/react/_components/Assignees/Assignees';
import Button from 'src/react/_components/Button/Button';
import SW from './DiscussionComposer.swiss';
import FMSW from 'src/react/_components/FormModal/FormModal.swiss';
import { fromJS } from 'immutable';

@withLoader
@connect(state => ({
  myId: state.me.get('user_id'),
  organization: state.organization
}))
export default class DiscussionComposer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      publicChecked: true,
      orgValue: props.myId,
      followers: fromJS([])
    };
  }

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
  handlePrivacyChange = e => {
    this.setState({
      publicChecked: !this.state.publicChecked
    });
  };
  handleOrgChange = orgValue => {
    this.setState({
      orgValue,
      followers: fromJS([])
    });
  };
  handleTopicChange = e => {
    this.setState({
      topic: e.target.value
    });
  };
  renderActionBar() {
    const { followers } = this.state;
    const { loader } = this.props;

    return (
      <SW.ActionBar>
        <SW.AssignSection />
        <SW.Seperator />
        <SW.PostButton />
      </SW.ActionBar>
    );
  }
  render() {
    const { topic, orgValue, followers, publicChecked } = this.state;
    const { myId, loader } = this.props;
    const topicPlaceholder = 'Topic';

    return (
      <FMSW.Wrapper>
        <FMSW.Title>New Discussion</FMSW.Title>
        <FMSW.InputContainer>
          <FMSW.InputWrapper>
            <FMSW.Label>1. Set the topic</FMSW.Label>
            <FMSW.Input
              value={topic}
              onChange={this.handleTopicChange}
              placeholder={topicPlaceholder}
              type="text"
              autoFocus
            />
          </FMSW.InputWrapper>
          <FMSW.InputWrapper>
            <FMSW.Label>2. Choose belonging</FMSW.Label>
            <OrgPicker value={orgValue} onChange={this.handleOrgChange} />
          </FMSW.InputWrapper>
          {orgValue !== myId && (
            <>
              <FMSW.InputWrapper>
                <FMSW.Label>3. Choose privacy</FMSW.Label>
                <SW.CheckboxWrapper onClick={this.handlePrivacyChange}>
                  <input
                    onChange={this.handlePrivacyChange}
                    type="checkbox"
                    checked={publicChecked}
                  />
                  <SW.CheckboxValue>
                    Public - anyone in the organization join the discussion
                  </SW.CheckboxValue>
                </SW.CheckboxWrapper>
              </FMSW.InputWrapper>
              <FMSW.InputWrapper>
                <FMSW.Label>4. Tag people</FMSW.Label>
                <Assignees users={followers} size={24} maxImages={9}>
                  <Button.Standard title="Assign People" />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          )}
        </FMSW.InputContainer>
        <FMSW.ButtonWrapper>
          <Button.Rounded
            title="Create discussion"
            onClick={this.handlePostSubmit}
            status={loader.get('discussion')}
          />
        </FMSW.ButtonWrapper>
      </FMSW.Wrapper>
    );
  }
}
