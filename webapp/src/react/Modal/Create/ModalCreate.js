import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import request from 'core/utils/request';
import contextMenu from 'src/utils/contextMenu';
import cachedCallback from 'src/utils/cachedCallback';
import withLoader from 'src/react/_hocs/withLoader';

import TeamPicker from '_shared/TeamPicker/TeamPicker';
import InputToggle from '_shared/Input/Toggle/InputToggle';
import InputText from '_shared/Input/Text/InputText';
import Spacing from '_shared/Spacing/Spacing';
import Assignees from '_shared/Assignees/Assignees';
import AssignMenu from '_shared/AssignMenu/AssignMenu';
import Button from '_shared/Button/Button';

import SW from './ModalCreate.swiss';
import FMSW from '_shared/FormModal/FormModal.swiss';

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
      members: fromJS([])
    };
  }

  handleAssignClick = e => {
    const { members, ownedBy } = this.state;

    contextMenu(AssignMenu, e, {
      excludeMe: true,
      selectedIds: members,
      teamId: ownedBy,
      onClose: this.handleAssignSelect
    });
  };
  handleAssignSelect = members => {
    this.setState({ members: fromJS(members) });
  };

  handleCreate = async () => {
    const { hideModal, loader, myId, type, onSuccess } = this.props;
    const { members, titleVal, privacy, ownedBy } = this.state;

    let endpoint = 'discussion.add';
    let analyticsEvent = 'Chat created';

    const options = {
      title: titleVal,
      owned_by: ownedBy,
      privacy,
      members: members.toJS()
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
          'Tagged people': members.size
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
      members: fromJS([])
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
    const { titleVal, ownedBy, members, privacy } = this.state;
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
            <FMSW.InputWrapper>
              <FMSW.Label>Team</FMSW.Label>
              <Spacing height={9} />
              <TeamPicker
                value={ownedBy}
                onChange={this.handleTeamChange}
                disablePersonal={type === 'discussion'}
              />
            </FMSW.InputWrapper>
            <>
              {type === 'project' && (
                <FMSW.InputWrapper>
                  <FMSW.Label>Access</FMSW.Label>
                  <Spacing height={9} />
                  {this.renderPrivacyCheckbox('public')}
                  {this.renderPrivacyCheckbox('private')}
                </FMSW.InputWrapper>
              )}
              <FMSW.InputWrapper>
                <FMSW.Label>Followers</FMSW.Label>
                <Spacing height={9} />
                <Assignees
                  userIds={members}
                  teamId={ownedBy}
                  size={36}
                  maxImages={9}
                  onClick={this.handleAssignClick}
                >
                  <Button
                    title="Tag members"
                    onClick={this.handleAssignClick}
                    border
                    disabled={ownedBy === myId || privacy === 'public'}
                  />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          </FMSW.InputContainer>
          <FMSW.ButtonWrapper>
            {type === 'discussion' && (
              <SW.ToggleWrapper>
                <FMSW.Label>Secret Chat</FMSW.Label>
                <SW.InputWrapper>
                  <InputToggle
                    value={privacy === 'private' ? true : false}
                    onChange={
                      privacy === 'private'
                        ? this.handlePrivacyCached('public')
                        : this.handlePrivacyCached('private')
                    }
                  />
                </SW.InputWrapper>
              </SW.ToggleWrapper>
            )}
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
