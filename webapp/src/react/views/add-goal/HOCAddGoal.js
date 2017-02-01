import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import Button from 'Button';
import { fromJS } from 'immutable';
import { setupDelegate, bindAll, randomString } from 'classes/utils';

import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
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
        tabIndex: -1,
      },
    }];
  }
  constructor(props) {
    super(props);
    this.state = initialState.toObject();
    if (props.cache) {
      this.state = props.cache.toObject();
    }

    bindAll(this, ['clickedAdd', 'onHandoffChange', 'onSave', 'onInputChange']);
    this.callDelegate = setupDelegate(props.delegate);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
    const input = document.getElementById('navbar-input');
    input.value = this.state.title;
    input.focus();
  }
  componentDidUpdate() {
    if (this._loadedWay) {
      const input = document.getElementById('navbar-input');
      input.focus();
      input.setSelectionRange(0, input.value.length);
      this._loadedWay = false;
    }
  }
  componentWillUnmount() {
    const { saveCache } = this.props;
    saveCache('add-goal', fromJS(this.state));
    this._unmounted = true;
  }
  updateState(newState) {
    this.setState(newState);
  }
  onHandoffChange(handoff) {
    this.updateState({ handoff });
  }
  onInputChange(text) {
    this.updateState({ title: text });
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
          title: way.get('title'),
        };
        const input = document.getElementById('navbar-input');
        input.value = way.get('title');
        this._loadedWay = true;
        this.updateState(newState);
      }
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
    stepOrder = stepOrder.push(id);
    this.updateState({ steps, stepOrder });
  }
  onOpenAssignee(id, e) {
    this.clickedAssign(e, id);
  }
  onUpdatedStepTitle(id, title) {
    let { steps } = this.state;
    steps = steps.setIn([id, 'title'], title);
    this.updateState({ steps });
  }
  onUpdatedAssignees(id, assignees) {
    let { steps } = this.state;
    steps = steps.setIn([id, 'assignees'], fromJS(assignees));
    this.updateState({ steps });
  }
  onAddAttachment(obj) {
    let { attachments, attachmentOrder } = this.state;
    attachments = attachments.set(obj.shortUrl, fromJS(obj));
    attachmentOrder = attachmentOrder.push(obj.shortUrl);
    if (!this._unmounted) {
      this.updateState({ attachments, attachmentOrder });
    } else {
      const { saveCache } = this.props;
      saveCache('add-goal', fromJS(Object.assign({}, this.state, {
        attachments,
        attachmentOrder,
      })));
    }
  }
  onRemoveAttachment(id) {
    let { attachments, attachmentOrder } = this.state;
    attachments = attachments.delete(id);
    attachmentOrder = attachmentOrder.filter(a => a !== id);
    this.updateState({ attachments, attachmentOrder });
  }
  clickedAssign(e, id) {
    const { selectAssignees } = this.props;
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
      this.updateState({ steps });
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
      removeCache,
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
          removeCache('add-goal');
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
    const { me } = this.props;
    if (!this.isReadyToCreate()) {
      return undefined;
    }
    const src = me.get('profile_pic');
    return (
      <HandoffWriteMessage
        text={handoff}
        imgSrc={src}
        onChange={this.onHandoffChange}
      />
    );
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
        {this.renderSteps()}
        <div className={infoClass}>
          {this.renderAttachments()}
        </div>
        {this.renderActions()}
      </div>
    );
  }
}

const { func, object, string } = PropTypes;

HOCAddGoal.propTypes = {
  delegate: object,
  addToasty: func,
  updateToasty: func,
  navPop: func,
  removeCache: func,
  request: func,
  organization_id: string,
  saveCache: func,
  loadWay: func,
  saveWay: func,
  selectAssignees: func,
  cache: map,

  me: map,
};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
    cache: state.getIn(['main', 'cache', 'add-goal']),
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
  };
}

export default connect(mapStateToProps, {
  selectAssignees: actions.goals.selectAssignees,
  saveCache: actions.main.cache.save,
  removeCache: actions.main.cache.remove,
  request: actions.api.request,
  addToasty: actions.toasty.add,
  updateToasty: actions.toasty.update,
  loadWay: actions.ways.load,
  saveWay: actions.ways.save,
})(HOCAddGoal);
