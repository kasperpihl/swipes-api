import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import request from 'swipes-core-js/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import OrgPicker from 'src/react/_components/OrgPicker/OrgPicker';
import cachedCallback from 'src/utils/cachedCallback';
import Assignees from 'src/react/_components/Assignees/Assignees';
import Button from 'src/react/_components/Button/Button';
import SW from './ChatCreate.swiss';
import FMSW from 'src/react/_components/FormModal/FormModal.swiss';
import { fromJS } from 'immutable';

@withLoader
@connect(state => ({
  myId: state.me.get('user_id'),
  organization: state.organization
}))
export default class ChatCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      privacy: 'public',
      ownedBy: props.myId,
      followers: fromJS([])
    };
  }

  handleAssignClick = e => {
    const { contextMenu } = this.props;
    contextMenu(AssignMenu, {
      selectedIds: followers
    });
  };
  handleAssignSelect(followers) {
    if (followers) {
      this.setState({ followers });
    }
  }

  handleCreate = () => {
    const { hideModal, loader, myId } = this.props;
    const { followers, topic, privacy, ownedBy } = this.state;
    console.log(ownedBy);
    loader.set('discussion', 'Creating');
    request('discussion.add', {
      topic: topic,
      owned_by: ownedBy,
      privacy,
      followers: followers.toJS()
    }).then(res => {
      if (res.ok) {
        hideModal();
        window.analytics.sendEvent('Discussion created', {
          Privacy: privacy,
          'Owned By': ownedBy === myId ? 'Personal' : 'Company',
          'Tagged people': followers.size
        });
      } else {
        loader.error('discussion', res.error, 3000);
      }
    });
  };
  handlePrivacyCached = cachedCallback(privacy => this.setState({ privacy }));
  handleOrgChange = ownedBy => {
    this.setState({
      ownedBy,
      followers: fromJS([])
    });
  };
  handleTopicChange = e => {
    this.setState({
      topic: e.target.value
    });
  };

  renderPrivacyCheckbox(iAmPrivacy) {
    const { privacy } = this.state;
    let label = 'Public - anyone in the organization can join';
    if (iAmPrivacy !== 'public') {
      label = 'Private - only tagged people can join';
    }

    return (
      <SW.CheckboxWrapper onClick={this.handlePrivacyCached(iAmPrivacy)}>
        <input
          onChange={this.handlePrivacyCached(iAmPrivacy)}
          type="radio"
          name="privacy"
          checked={privacy === iAmPrivacy}
        />
        <SW.CheckboxValue>{label}</SW.CheckboxValue>
      </SW.CheckboxWrapper>
    );
  }
  render() {
    const { topic, ownedBy, followers } = this.state;
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
              style={{ paddingLeft: '6px' }}
              autoFocus
            />
          </FMSW.InputWrapper>
          <FMSW.InputWrapper>
            <FMSW.Label>2. Choose belonging</FMSW.Label>
            <OrgPicker value={ownedBy} onChange={this.handleOrgChange} />
          </FMSW.InputWrapper>
          {ownedBy !== myId && (
            <>
              <FMSW.InputWrapper>
                <FMSW.Label>3. Choose privacy</FMSW.Label>
                {this.renderPrivacyCheckbox('public')}
                {this.renderPrivacyCheckbox('private')}
              </FMSW.InputWrapper>
              <FMSW.InputWrapper>
                <FMSW.Label>4. Tag people</FMSW.Label>
                <Assignees users={followers} size={36} maxImages={9}>
                  <Button.Standard
                    title="Assign People"
                    onClick={this.handleAssignClick}
                  />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          )}
        </FMSW.InputContainer>
        <FMSW.ButtonWrapper>
          <Button.Rounded
            title="Create discussion"
            onClick={this.handleCreate}
            status={loader.get('discussion')}
          />
        </FMSW.ButtonWrapper>
      </FMSW.Wrapper>
    );
  }
}
