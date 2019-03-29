import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import request from 'core/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import TeamPicker from 'src/react/_components/TeamPicker/TeamPicker';
import cachedCallback from 'src/utils/cachedCallback';
import Assignees from 'src/react/_components/Assignees/Assignees';
import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import Button from 'src/react/_components/Button/Button';
import SW from './ModalCreate.swiss';
import FMSW from 'src/react/_components/FormModal/FormModal.swiss';
import contextMenu from 'src/utils/contextMenu';
import InputText from '_shared/Input/Text/InputText';
import Spacing from '_shared/Spacing/Spacing';

@withLoader
@connect(state => ({
  myId: state.me.get('user_id')
}))
export default class ModalCreate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      titleVal: '',
      privacy: 'public',
      ownedBy: undefined,
      followers: fromJS([])
    };
  }

  handleAssignClick = e => {
    const { followers, ownedBy } = this.state;

    contextMenu(AssignMenu, e, {
      excludeMe: true,
      selectedIds: followers,
      teamId: ownedBy,
      onClose: this.handleAssignSelect
    });
  };
  handleAssignSelect = followers => {
    this.setState({ followers: fromJS(followers) });
  };

  handleCreate = async () => {
    const { hideModal, loader, myId, type, onSuccess } = this.props;
    const { followers, titleVal, privacy, ownedBy } = this.state;

    let endpoint = 'discussion.add';
    let analyticsEvent = 'Chat created';

    const options = {
      title: titleVal,
      owned_by: ownedBy,
      privacy,
      followers: followers.toJS()
    };

    loader.set('creating', 'Creating');

    if (type === 'project') {
      endpoint = 'project.add';
      analyticsEvent = 'Project created';
    }

    request(endpoint, options).then(res => {
      if (res.ok) {
        if (typeof onSuccess === 'function') {
          onSuccess(res);
        }
        hideModal();
        window.analytics.sendEvent(analyticsEvent, {
          Privacy: privacy,
          'Owned By': ownedBy === myId ? 'Personal' : 'Company',
          'Tagged people': followers.size
        });
      } else {
        loader.error('creating', res.error, 3000);
      }
    });
  };
  handlePrivacyCached = cachedCallback(privacy => this.setState({ privacy }));
  handleTeamChange = ownedBy => {
    this.setState({
      ownedBy,
      followers: fromJS([])
    });
  };
  handleTitleChange = e => {
    this.setState({
      titleVal: e.target.value
    });
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleCreate();
    }
  };

  renderPrivacyCheckbox(iAmPrivacy) {
    const { privacy, ownedBy } = this.state;
    const { myId } = this.props;
    let label = 'Public - everyone from the team have access';
    if (iAmPrivacy !== 'public') {
      label = 'Private - only chosen people have access';
    }

    return (
      <SW.CheckboxWrapper
        onClick={this.handlePrivacyCached(iAmPrivacy)}
        checked={privacy === iAmPrivacy}
        disabled={ownedBy === myId}
      >
        <SW.Input
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
    const { titleVal, ownedBy, followers, privacy } = this.state;
    const { myId, loader, type } = this.props;

    let title = 'New Chat';
    const titlePlaceholder = 'Title';
    let createLabel = 'Create chat';
    if (type === 'project') {
      title = 'New Project';
      createLabel = 'Create project';
    }

    return (
      <SW.Wrapper>
        <FMSW.Wrapper create>
          <FMSW.Header>
            <FMSW.Title>{title}</FMSW.Title>
          </FMSW.Header>
          <Spacing height={30} />
          <FMSW.InputContainer>
            <FMSW.InputWrapper>
              <InputText
                value={titleVal}
                onChange={this.handleTitleChange}
                onKeyDown={this.handleKeyDown}
                placeholder={titlePlaceholder}
                type="text"
                style={{ paddingLeft: '6px' }}
                autoFocus
              />
            </FMSW.InputWrapper>
            <Spacing height={27} />
            <FMSW.InputWrapper>
              <FMSW.Label>Team</FMSW.Label>
              <Spacing height={9} />
              <TeamPicker
                value={ownedBy}
                onChange={this.handleTeamChange}
                disablePersonal={type === 'discussion'}
              />
            </FMSW.InputWrapper>
            <Spacing height={24} />
            <>
              <FMSW.InputWrapper>
                <FMSW.Label>Access</FMSW.Label>
                <Spacing height={9} />
                {this.renderPrivacyCheckbox('public')}
                {this.renderPrivacyCheckbox('private')}
              </FMSW.InputWrapper>
              <Spacing height={20} />
              <FMSW.InputWrapper>
                <FMSW.Label>Members</FMSW.Label>
                <Spacing height={9} />
                <Assignees
                  userIds={followers}
                  teamId={ownedBy}
                  size={36}
                  maxImages={9}
                  onClick={this.handleAssignClick}
                >
                  <Button
                    title="Tag people"
                    onClick={this.handleAssignClick}
                    border
                    disabled={privacy === 'public' || ownedBy === myId}
                  />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          </FMSW.InputContainer>
          <FMSW.ButtonWrapper>
            <FMSW.Button
              title={createLabel}
              onClick={this.handleCreate}
              status={loader.get('creating')}
              border
            />
          </FMSW.ButtonWrapper>
        </FMSW.Wrapper>
      </SW.Wrapper>
    );
  }
}
