import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import request from 'core/utils/request';
import withLoader from 'src/react/_hocs/withLoader';
import OrgPicker from 'src/react/_components/OrgPicker/OrgPicker';
import cachedCallback from 'src/utils/cachedCallback';
import Assignees from 'src/react/_components/Assignees/Assignees';
import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import Button from 'src/react/_components/Button/Button';
import SW from './ModalCreate.swiss';
import FMSW from 'src/react/_components/FormModal/FormModal.swiss';
import contextMenu from 'src/utils/contextMenu';

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
      ownedBy: props.myId,
      followers: fromJS([])
    };
  }

  handleAssignClick = e => {
    const { followers, ownedBy } = this.state;

    contextMenu(AssignMenu, e, {
      excludeMe: true,
      selectedIds: followers,
      organizationId: ownedBy,
      onClose: this.handleAssignSelect
    });
  };
  handleAssignSelect = followers => {
    this.setState({ followers: fromJS(followers) });
  };

  handleCreate = async () => {
    const { hideModal, loader, myId, type } = this.props;
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

    if (type === 'plan') {
      endpoint = 'plan.add';
      delete options.title;
      analyticsEvent = 'Plan created';
    }
    if (type === 'project') {
      endpoint = 'project.add';
      analyticsEvent = 'Project created';
    }

    request(endpoint, options).then(res => {
      if (res.ok) {
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
  handleOrgChange = ownedBy => {
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

  renderPrivacyCheckbox(iAmPrivacy) {
    const { privacy } = this.state;
    let label = 'Public - anyone in organization can find this';
    if (iAmPrivacy !== 'public') {
      label = 'Private - only chosen people have access';
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
    const { titleVal, ownedBy, followers } = this.state;
    const { myId, loader, type } = this.props;

    let title = 'New Chat';
    const titlePlaceholder = 'Title';
    const titleLabel = '1. Set the title';
    let createLabel = 'Create chat';
    if (type === 'plan') {
      title = 'New Plan';
      createLabel = 'Create plan';
    }
    if (type === 'project') {
      title = 'New Project';
      createLabel = 'Create project';
    }

    return (
      <FMSW.Wrapper>
        <FMSW.Title>{title}</FMSW.Title>
        <FMSW.InputContainer>
          {type !== 'plan' && (
            <FMSW.InputWrapper>
              <FMSW.Label>{titleLabel}</FMSW.Label>
              <FMSW.Input
                value={titleVal}
                onChange={this.handleTitleChange}
                placeholder={titlePlaceholder}
                type="text"
                style={{ paddingLeft: '6px' }}
                autoFocus
              />
            </FMSW.InputWrapper>
          )}
          <FMSW.InputWrapper>
            <FMSW.Label>2. Choose belonging</FMSW.Label>
            <OrgPicker
              value={ownedBy}
              onChange={this.handleOrgChange}
              disablePersonal={type === 'discussion'}
            />
          </FMSW.InputWrapper>
          {ownedBy !== myId && (
            <>
              <FMSW.InputWrapper>
                <FMSW.Label>3. Choose privacy</FMSW.Label>
                {this.renderPrivacyCheckbox('public')}
                {this.renderPrivacyCheckbox('private')}
              </FMSW.InputWrapper>
              <FMSW.InputWrapper>
                <FMSW.Label>4. Choose people</FMSW.Label>
                <Assignees
                  userIds={followers}
                  organizationId={ownedBy}
                  size={36}
                  maxImages={9}
                  onClick={this.handleAssignClick}
                >
                  <Button title="Tag people" onClick={this.handleAssignClick} />
                </Assignees>
              </FMSW.InputWrapper>
            </>
          )}
        </FMSW.InputContainer>
        <FMSW.ButtonWrapper>
          <Button
            title={createLabel}
            onClick={this.handleCreate}
            status={loader.get('creating')}
          />
        </FMSW.ButtonWrapper>
      </FMSW.Wrapper>
    );
  }
}
