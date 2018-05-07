import React, { PureComponent, Fragment } from 'react';
import { styleElement } from 'react-swiss';

import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';

import GoalsUtil from 'swipes-core-js/classes/goals-util';
import SWView from 'SWView';
import HOCAttachButton from 'components/attachments/HOCAttachButton';
import Button from 'src/react/components/button/Button2';
import './styles/goal-overview.scss';
import styles from './GoalOverview.swiss';
import Icon from 'Icon';
import StepAdd from '../goal-components/step-add/StepAdd';
import StepItem from '../goal-components/step-item/StepItem';
import GoalHeader from '../goal-components/goal-header/GoalHeader';

import GoalFooter from '../goal-components/goal-footer/GoalFooter';
import GoalAttachment from '../goal-components/goal-attachment/GoalAttachment';

const Header = styleElement('div', styles.Header);
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
    const { stepOrder } = this.props;
    const { editMode } = this.state;
    const helper = this.getHelper();
    const order = stepOrder || helper.getStepOrder();
    return (
      <Fragment>
        <Dropper droppableId="steps" type="step">
          {order.map((stepId, i) => {
            const step = helper.getStepById(stepId);
            return (
              <Dragger
                draggableId={step.get('id')}
                index={i}
                passHandle
                key={step.get('id')}>
                {(provided, snapshot) => {
                  console.log(provided);
                  return (
                  <StepItem
                    goalId={helper.getId()}
                    step={step}
                    number={i + 1}
                    editMode={editMode}
                    dragProvided={provided}
                  />
                  )
                }
                }
                
              </Dragger>
            )
          }).toArray()}
        </Dropper>
        <StepAdd goalId={helper.getId()} />
      </Fragment>
    );
  }

  renderAttachments() {
    const { attachmentOrder } = this.props;
    const helper = this.getHelper();

    const order = attachmentOrder || helper.getAttachmentOrder();
    return (
      <Dropper droppableId="attachments" type="attachment">
        {order.map((attId, i) => {
          const attachment = helper.getAttachmentById(attId);
          return (
            <Dragger
              draggableId={attId}
              index={i}
              key={attId}>
              <GoalAttachment
                goalId={helper.getId()}
                attachment={attachment}
                id={attId}
              />
            </Dragger>
          )
        }).toArray()}
      </Dropper>
    );
  }
  render() {
    const { goal, viewWidth, delegate, getLoading } = this.props;
    const { editMode, showLine } = this.state;

    if (!goal) {
      return null;
    }

    return (
      <SWView
        header={(
          <GoalHeader
            goal={goal}
            delegate={delegate}
            showLine={showLine}
            dotsLoading={getLoading('dots')}
          />
        )}
        onScroll={this.onScroll}
        footer={<GoalFooter goal={goal} />}>
        <Wrapper>
          <Side>
            <Section>
              STEPS
              {!!this.getHelper().getStepOrder().size && (
                <Button 
                  title={editMode ? 'Done' : 'Edit'}
                  onClick={this.onEdit}
                />
              )}
            </Section>
            {this.renderCompletedState()}
            {this.renderSteps()}
          </Side>
          <Side viewWidth={viewWidth} right>
            <Section>
              ATTACHMENTS
              <HOCAttachButton delegate={delegate} />
            </Section>
            {this.renderAttachments()}
          </Side>
        </Wrapper>
      </SWView>
    );
  }
}

export default GoalOverview;