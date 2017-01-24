import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';
import ReactTextarea from 'react-textarea-autosize';
import Button from 'Button';
import { fromJS } from 'immutable';
import { setupDelegate, bindAll, randomString } from 'classes/utils';

import HOCAttachments from 'components/attachments/HOCAttachments';
import Section from 'components/section/Section';
import AddStepList from './AddStepList';

import './styles/add-goal.scss';

const initialState = fromJS({
  title: '',
  handoff: '',
  steps: {},
  stepOrder: [],
  attachments: {},
  attachmentOrder: [],
});

class HOCAddGoal extends Component {
  static contextButtons() {
    return [{
      component: 'Button',
      props: {
        text: 'Load a Way',
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = initialState.toObject();

    bindAll(this, ['clickedAdd', 'onTitleChange', 'onHandoffChange', 'onSave']);
    this.callDelegate = setupDelegate(props.delegate);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this._loadedWay) {
      const input = this.refs.input;
      input.focus();
      input.setSelectionRange(0, input.value.length);
      this._loadedWay = false;
    }
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

  onContextClick(i, e) {
    const { loadWay } = this.props;
    loadWay({
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'top',
      alignX: 'right',
    }, (way) => {
      if (way) {
        const goal = way.get('goal');
        const newState = {
          steps: goal.get('steps'),
          stepOrder: goal.get('step_order'),
          attachments: goal.get('attachments'),
          attachmentOrder: goal.get('attachment_order'),
          title: goal.get('title'),
        };
        this._loadedWay = true;
        this.setState(newState);
      }


      console.log('way', way.toJS());
    });
  }
  onSave(e) {
    const { saveWay } = this.props;
    const goal = this.getGoal();
    saveWay({
      boundingRect: e.target.getBoundingClientRect(),
      alignY: 'center',
      alignX: 'right',
    }, goal);
  }
  onAddedStep(title) {
    let { steps, stepOrder } = this.state;
    const id = randomString(6);
    steps = steps.set(id, fromJS({
      id,
      title,
      assignees: [],
    }));
    console.log(steps.toJS());
    stepOrder = stepOrder.push(id);
    this.setState({ steps, stepOrder });
  }
  onOpenAssignee(id, e) {
    this.clickedAssign(e, id);
  }
  onUpdatedStepTitle(id, title) {
    let { steps } = this.state;
    steps = steps.setIn([id, 'title'], title);
    this.setState({ steps });
  }
  onUpdatedAssignees(id, assignees) {
    let { steps } = this.state;
    steps = steps.setIn([id, 'assignees'], fromJS(assignees));
    this.setState({ steps });
  }
  onAddAttachment(obj) {
    let { attachments, attachmentOrder } = this.state;
    attachments = attachments.set(obj.shortUrl, fromJS(obj));
    attachmentOrder = attachmentOrder.push(obj.shortUrl);
    this.setState({ attachments, attachmentOrder });
  }
  clickedAssign(e, id) {
    const { assignModal, selectAssignees } = this.props;
    const { steps, stepOrder } = this.state;
    const i = stepOrder.findKey(v => v === id);
    return selectAssignees({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'left',
    }, steps.getIn([id, 'assignees']).toJS(), (assignees) => {
      if (assignees) {
        this.onUpdatedAssignees(id, assignees);
      } else {
        const ref = this.refs.list.refs[`input${i}`];
        if (ref) {
          ref.focus();
        }
      }
    });
  }
  selectedAssignees(id, res) {
    if (res) {
      let { steps } = this.state;
      steps = steps.setIn([id, 'assignees'], fromJS(res));
      this.setState({ steps });
    }
  }
  isReadyToCreate() {
    const { steps, title } = this.state;
    return (steps.size && title.length);
  }
  getGoal() {
    const {
      steps,
      title,
      attachments,
      stepOrder,
      attachmentOrder,
    } = this.state;

    const goal = {
      steps: steps.toJS(),
      step_order: stepOrder.toJS(),
      title,
      attachments: attachments.toJS(),
      attachment_order: attachmentOrder.toJS(),
    };
    return goal;
  }
  clickedAdd() {
    const {
      handoff,
      title,
    } = this.state;
    const {
      organization_id,
      request,
      addToasty,
      updateToasty,
      navPop,
    } = this.props;

    const goal = this.getGoal();
    addToasty({ title: `Adding: ${title}`, loading: true }).then((toastId) => {
      request('goals.create', {
        message: handoff,
        organization_id,
        goal,
      }).then((res) => {
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
          ref="input"
          type="text"
          value={title}
          className="add-goal__title"
          placeholder="Goal Name"
          onChange={this.onTitleChange}
          autoFocus
        />
      </div>
    );
  }
  renderSteps() {
    const { steps, stepOrder } = this.state;
    return (
      <Section title="Steps" maxWidth={780}>
        <AddStepList
          ref="list"
          steps={steps}
          stepOrder={stepOrder}
          delegate={this}
        />
      </Section>
    );
  }
  renderAttachments() {
    const { attachments, attachmentOrder } = this.state;

    if (!this.isReadyToCreate()) {
      return undefined;
    }

    return (
      <Section title="Attachments" maxWidth={780}>
        <HOCAttachments
          attachments={attachments}
          attachmentOrder={attachmentOrder}
          delegate={this}
        />
      </Section>
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

    let saveButton;
    if (this.isReadyToCreate()) {
      saveButton = (
        <Button
          text="Save as a Way"
          className="add-goal__btn add-goal__btn--save"
          onClick={this.onSave}
        />
      );
    }

    return (
      <Section title="Create Goal" maxWidth={780}>
        {this.renderHandoff()}
        <div className="add-goal__footer">
          {statusHtml}
          <div className="add-goal__actions">
            {saveButton}
            <Button
              text="Create Goal"
              primary
              disabled={disabled}
              className="add-goal__btn add-goal__btn--cta"
              onClick={this.clickedAdd}
            />
          </div>
        </div>
      </Section>
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
  loadWay: actions.ways.load,
  saveWay: actions.ways.save,
})(HOCAddGoal);
