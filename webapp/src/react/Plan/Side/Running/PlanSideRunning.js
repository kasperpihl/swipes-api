import React, { Component } from 'react';
import request from 'core/utils/request';
import contextMenu from 'src/utils/contextMenu';
import withNav from 'src/react/_hocs/Nav/withNav';

import AssignMenu from 'src/react/_components/AssignMenu/AssignMenu';
import SideHeader from 'src/react/_components/SideHeader/SideHeader';
import ProgressBar from 'src/react/_components/ProgressBar/ProgressBar';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';
import FormModal from 'src/react/_components/FormModal/FormModal';

import SW from './PlanSideRunning.swiss';

@withNav
export default class PlanSideRunning extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followers: []
    };
  }
  completeProject = () => {
    const { plan } = this.props;
    request('plan.end', {
      plan_id: plan.get('plan_id')
    });
  };

  openCompletionModal = () => {
    const { plan, nav } = this.props;
    nav.openModal(FormModal, {
      title: 'Complete project',
      subtitle: `Are you sure that you want to complete project ${plan.get(
        'title'
      )}?`,
      confirmLabel: 'Complete',
      onConfirm: this.completeProject
    });
  };

  handleAssignSelect = followers => {
    this.setState({ followers: fromJS(followers) });
  };

  handleAssignClick = e => {
    const { followers } = this.state;
    const { plan } = this.props;

    contextMenu(AssignMenu, e, {
      excludeMe: true,
      selectedIds: followers,
      organizationId: plan.get('owned_by'),
      onSelect: this.handleAssignSelect
    });
  };

  render() {
    const { plan } = this.props;
    return (
      <SW.Wrapper>
        <SideHeader
          title={plan.get('task_counter')}
          subtitle="Tasks selected"
        />
        <ProgressBar />
        <SW.ButtonWrapper>
          <SW.Button
            title="Complete project"
            icon="Complete"
            onClick={this.openCompletionModal}
          />
          <SW.Button
            title="Add people"
            icon="Assign"
            onClick={this.handleAssignClick}
          />
        </SW.ButtonWrapper>
        <StepSlider />
      </SW.Wrapper>
    );
  }
}
