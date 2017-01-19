import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import ReactTextarea from 'react-textarea-autosize';
import Button from 'Button';
import { fromJS } from 'immutable';
import { setupDelegate, bindAll } from 'classes/utils';

import HOCAttachments from 'components/attachments/HOCAttachments';
import AddGoalList from './AddGoalList';
import StepSection from '../goals/goal-step/StepSection';

import './styles/add-goal.scss';

const initialState = fromJS({
  title: '',
  handoff: '',
  steps: [],
  attachments: [],
});

class HOCAddGoal extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        text: 'Load a Way',
        primary: true,
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = initialState.toObject();

    bindAll(this, ['clickedAdd', 'onTitleChange', 'onHandoffChange']);
    this.callDelegate = setupDelegate(props.delegate);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
    // this.refs.input.focus();
  }
  onTitleChange(e) {
    this.setState({ title: e.target.value });
  }
  onHandoffChange(e) {
    this.setState({ handoff: e.target.value });
  }
  onAddedStep(title) {
    let { steps } = this.state;
    steps = steps.push(fromJS({
      title,
      assignees: [],
    }));
    this.setState({ steps });
  }
  onUpdatedStepTitle(i, title) {
    let { steps } = this.state;
    steps = steps.setIn([i, 'title'], title);
    this.setState({ steps });
  }
  onAddAttachment(obj) {
    let { attachments } = this.state;
    attachments = attachments.push(fromJS(obj));
    this.setState({ attachments });
  }
  clickedAssign(e, i) {
    const { assignModal, selectAssignees } = this.props;
    const { steps } = this.state;
    return selectAssignees({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    }, steps.getIn([i, 'assignees']));

    return assignModal(
      steps.getIn([i, 'assignees']),
      this.selectedAssignees.bind(this, i),
    );
  }
  selectedAssignees(i, res) {
    if (res) {
      let { steps } = this.state;
      steps = steps.setIn([i, 'assignees'], fromJS(res));
      this.setState({ steps });
    }
  }
  isReadyToCreate() {
    const { steps, title } = this.state;
    return (steps.size && title.length);
  }
  clickedAdd() {
    const { steps, title, attachments } = this.state;
    const { organization_id, request, addToasty, updateToasty, navPop } = this.props;
    const goal = {
      steps: steps.toJS(),
      title,
      attachments: attachments.toJS(),
    };

    addToasty({ title: `Adding: ${title}`, loading: true }).then((toastId) => {
      request('goals.create', { organization_id, goal }).then((res) => {
        if (res.ok) {
          updateToasty(toastId, {
            title: 'Added goal',
            completed: true,
            duration: 3000,
          });
        } else {
          updateToasty(toastId, {
            title: 'Error adding goal',
            loading: false,
            duration: 3000,
          });
        }
      });

      navPop();
    });
  }
  renderHeader() {
    const { title } = this.state;
    return (
      <div className="add-goal__header">
        <input
          type="text"
          value={title}
          className="add-goal__title"
          placeholder="Goal Name"
          onChange={this.onTitleChange}
        />
      </div>
    );
  }
  renderSteps() {
    const { steps } = this.state;
    return (
      <AddGoalList
        steps={steps}
        delegate={this}
      />
    );
  }
  renderAttachments() {
    const { attachments } = this.state;

    if (!this.isReadyToCreate()) {
      return undefined;
    }

    return (
      <StepSection title="Attachments">
        <HOCAttachments
          attachments={attachments}
          delegate={this}
        />
      </StepSection>
    );
  }

  renderHandoff() {
    const { handoff } = this.state;

    if (!this.isReadyToCreate()) {
      return undefined;
    }

    return (
      <ReactTextarea
        className="add-goal__handoff"
        value={handoff}
        minRows={3}
        maxRows={10}
        ref="textarea"
        onChange={this.onHandoffChange}
        placeholder="Pass on your initial message"
      />
    );
  }
  getStatus() {
    const { steps, title } = this.state;
    let status;

    if (!title || !title.length) {
      status = 'Please write a title for your goal';
    } else if (!steps.size) {
      status = 'Each goal must have at least one step.';
    }

    return status;
  }
  renderActions() {
    const status = this.getStatus();
    const disabled = !!status;
    let statusHtml;

    if (status) {
      statusHtml = (
        <div className="add-goal__status">{status}</div>
      );
    }

    return (
      <StepSection title="Create Goal">
        {this.renderHandoff()}
        <div className="add-goal__footer">
          {statusHtml}
          <div className="add-goal__actions">
            <Button text="Cancel" className="add-goal__btn add-goal__btn--cancel" />
            <Button
              text="Create Goal"
              primary
              disabled={disabled}
              className="add-goal__btn add-goal__btn--cta"
              onClick={this.clickedAdd}
            />
          </div>
        </div>
      </StepSection>
    );
  }
  render() {
    const { steps } = this.state;
    let infoClass = 'add-goal__info';

    if (steps.size) {
      infoClass += ' add-goal__info--show';
    }

    return (
      <div className="add-goal">
        {this.renderHeader()}

        {this.renderSteps()}
        <div className={infoClass}>
          {this.renderAttachments()}
        </div>
        {this.renderActions()}
      </div>
    );
  }
}

const { func, object } = PropTypes;

HOCAddGoal.propTypes = {
  delegate: object,
  assignModal: func,
};

function mapStateToProps(state) {
  return {
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
  };
}

export default connect(mapStateToProps, {
  assignModal: actions.modal.assign,
  selectAssignees: actions.goals.selectAssignees,
  navPop: actions.navigation.pop,
  request: actions.api.request,
  addToasty: actions.toasty.add,
  updateToasty: actions.toasty.update,
})(HOCAddGoal);
