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
    const { hideModal, loader, onSuccess } = this.props;
    const { members, titleVal, privacy, ownedBy } = this.state;

    const options = {
      title: titleVal,
      owned_by: ownedBy,
      privacy,
      members: members.toJS()
    };

    loader.set('creating', 'Creating');

    request('project.add', options).then(res => {
      if (res.ok) {
        if (typeof onSuccess === 'function') {
          onSuccess(res);
        }
        hideModal();
        window.analytics.sendEvent('Project created', ownedBy, {
          Privacy: privacy,
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

    return (
      <SW.Wrapper>
        <FMSW.Wrapper create>
          <FMSW.Header>
            <FMSW.Title>New Project</FMSW.Title>
          </FMSW.Header>
          <FMSW.InputContainer>
            <FMSW.InputWrapper>
              <InputText
                value={titleVal}
                onChange={this.handleTitleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Title"
                type="text"
                style={{ paddingLeft: '6px' }}
                autoFocus
              />
            </FMSW.InputWrapper>
            <FMSW.InputWrapper>
              <FMSW.Label>Team</FMSW.Label>
              <Spacing height={9} />
              <TeamPicker value={ownedBy} onChange={this.handleTeamChange} />
            </FMSW.InputWrapper>
            <>
              <FMSW.InputWrapper>
                <FMSW.Label>Members</FMSW.Label>
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
                    disabled={
                      ownedBy === myId ||
                      (type === 'project' && privacy === 'public')
                    }
                  />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          </FMSW.InputContainer>
          <FMSW.ButtonWrapper>
            <SW.ToggleWrapper>
              <FMSW.Label>Secret Project</FMSW.Label>
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

            <FMSW.Button
              title="Create project"
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
