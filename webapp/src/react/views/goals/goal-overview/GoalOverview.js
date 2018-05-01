import React, { PureComponent } from 'react';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';

import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';

import GoalsUtil from 'swipes-core-js/classes/goals-util';
import SWView from 'SWView';
import HOCAttachments from 'components/attachments/HOCAttachments';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import InfoButton from 'components/info-button/InfoButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button2';
import './styles/goal-overview.scss';
import styles from './GoalOverview.swiss';
import StepItem from '../goal-components/step-item/StepItem';

const Header = styleElement('div', styles.Header);
const Footer = styleElement('div', styles.Footer);
const Wrapper = styleElement('div', styles.Wrapper);
const Side = styleElement('div', styles.Side);

/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onScroll', 'onCompleteGoal', 'onIncompleteGoal');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  renderHeader() {
    const { goal, getLoading, delegate, isLoading, showLine } = this.props;
    const helper = this.getHelper();
    const title = getLoading('title').loading;

    return (
      <Header showLine={showLine}>
        <HOCHeaderTitle
          title={title || goal.get('title')}
          delegate={delegate}
        >
          <HOCAssigning
            assignees={helper.getAssignees()}
            delegate={delegate}
            rounded
            key={helper.getAssignees().size ? 'assignees' : 'assign'}
            size={30}
            tooltipAlign="bottom"
          />
          <HOCDiscussButton
            context={{
              id: goal.get('id'),
              title: goal.get('title'),
            }}
            relatedFilter={msgGen.goals.getRelatedFilter(goal)}
            taggedUsers={helper.getAssigneesButMe().toArray()}
          />
          <InfoButton
            delegate={delegate}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </Header>
    );
  }
  renderSteps() {
    const { delegate, editMode } = this.props;
    const helper = this.getHelper();
    const numberOfCompleted = helper.getNumberOfCompletedSteps();
    const totalSteps = helper.getNumberOfSteps();
    let title = `Steps ${numberOfCompleted}/${totalSteps}`;
    if (!totalSteps) {
      title = 'Add steps';
    }
    return (
      <Side>
        <Dropper droppableId="steps">
          {helper.getOrderedSteps().map((step, i) => (
            <Dragger draggableId={step.get('id')} index={i} key={step.get('id')}>
              <StepItem goalId={helper.getId()} step={step} number={i + 1} />
            </Dragger>
          )).toArray()}
        </Dropper>
      </Side>
    );
  }

  renderAttachments() {
    const { delegate, goal, viewWidth } = this.props;
    console.log(viewWidth);
    return (
      <Side viewWidth={viewWidth} right>
        <HOCAttachments
          key="attachments"
          attachments={goal.get('attachments')}
          attachmentOrder={goal.get('attachment_order')}
          targetId={goal.get('id')}
          delegate={delegate}
        />
      </Side>
    );
  }
  renderFooter() {
    const { goal, getLoading, delegate } = this.props;
    const isComplete = this.getHelper().getIsCompleted();

    return (
      <Footer>
        <Button
          icon={isComplete ? 'Iteration' : 'Checkmark'}
          sideLabel={isComplete ? 'Incomplete goal' : 'Complete goal'}
          {...getLoading('completing')}
          onClick={isComplete ? this.onIncompleteGoal : this.onCompleteGoal}
        />
      </Footer>
    )
  }
  render() {
    const { goal } = this.props;

    if (!goal) {
      return null;
    }

    return (
      <SWView header={this.renderHeader()} onScroll={this.onScroll} footer={this.renderFooter()}>
        <Wrapper>
          {this.renderSteps()}
          {this.renderAttachments()}
        </Wrapper>
      </SWView>
    );
  }
}

export default GoalOverview;