import React, { PureComponent, Fragment } from 'react';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';

import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';

import GoalsUtil from 'swipes-core-js/classes/goals-util';
import SWView from 'SWView';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import InfoButton from 'components/info-button/InfoButton';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';
import Button from 'src/react/components/button/Button2';
import './styles/goal-overview.scss';
import styles from './GoalOverview.swiss';
import Icon from 'Icon';
import StepAdd from '../goal-components/step-add/StepAdd';
import StepItem from '../goal-components/step-item/StepItem';

const Header = styleElement('div', styles.Header);
const Footer = styleElement('div', styles.Footer);
const Wrapper = styleElement('div', styles.Wrapper);
const Section = styleElement('div', styles.Section);

const Side = styleElement('div', styles.Side);
const CompletedWrapper = styleElement('div', styles.CompletedWrapper);
const CompletedText = styleElement('div', styles.CompletedText);
const GreenIcon = styleElement(Icon, styles.GreenIcon);

/* global msgGen */
class GoalOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      showLine: false,
    };
    setupDelegate(this, 'onCompleteGoal', 'onIncompleteGoal');
  }
  getHelper() {
    const { goal, myId } = this.props;
    return new GoalsUtil(goal, myId);
  }
  onEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  }
  onScroll = (e) => {
    const { showLine } = this.state;
    const newShowLine = e.target.scrollTop > 0;

    if (showLine !== newShowLine) {
      this.setState({ showLine: newShowLine });
    }
  }
  renderHeader() {
    const { showLine } = this.state;
    const { goal, getLoading, delegate, isLoading } = this.props;
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
  renderCompletedState() {
    const helper = this.getHelper();
    const lastComplete = helper.getLastActivityByType('goal_completed');
    if(!helper.getIsCompleted() || !lastComplete) {
      return undefined;
      
    }

    const firstName = msgGen.users.getFirstName(lastComplete.get('done_by'));
    const completionText = `${firstName} completed this goal`;
    return (
      <CompletedWrapper>
        <GreenIcon icon="Checkmark" />
        <CompletedText>{completionText}</CompletedText>
      </CompletedWrapper>
    );
  }
  renderSteps() {
    const { editMode } = this.state;
    const helper = this.getHelper();

    return (
      <Fragment>
        <Dropper droppableId="steps">
          {helper.getOrderedSteps().map((step, i) => (
            <Dragger
              draggableId={step.get('id')}
              index={i}
              key={step.get('id')}>
              <StepItem
                goalId={helper.getId()}
                step={step}
                number={i + 1}
                editMode={editMode}
              />
            </Dragger>
          )).toArray()}
        </Dropper>
        <StepAdd goalId={helper.getId()} />
      </Fragment>
    );
  }

  renderAttachments() {
    const { delegate, goal, viewWidth } = this.props;
    return (
      <Side viewWidth={viewWidth} right>
        <Section>
          ATTACHMENTS
          <HOCAttachButton delegate={delegate} />
        </Section>
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
          <Side>
            <Section>
              STEPS
              {!!this.getHelper().getStepOrder().size && (
                <Button title="Edit" onClick={this.onEdit} />
              )}
            </Section>
            {this.renderCompletedState()}
            {this.renderSteps()}
          </Side>
          {this.renderAttachments()}
        </Wrapper>
      </SWView>
    );
  }
}

export default GoalOverview;