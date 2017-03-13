import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { cache } from 'swipes-core-js';
import Button from 'Button';
import SWView from 'SWView';
import { fromJS } from 'immutable';
import { setupDelegate, bindAll, randomString } from 'classes/utils';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HandoffWriteMessage from 'components/handoff-write-message/HandoffWriteMessage';
import HOCAttachments from 'components/attachments/HOCAttachments';
import Section from 'components/section/Section';
import AddStepList from './AddStepList';
import TemplateItem from './TemplateItem';

import './styles/add-goal.scss';

const initialState = fromJS({
  title: '',
  handoff: '',
  flags: [],
  steps: {},
  stepOrder: [],
  attachments: {},
  attachmentOrder: [],
});

class HOCAddGoal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState.toObject();
    if (props.cache) {
      this.state = props.cache.toObject();
    }

    bindAll(this, [
      'clickedAdd',
      'onHandoffChange',
      'onSave',
      'onInputChange',
      'onTitleKeyUp',
      'saveToCache',
      'onLoadWay',
      'onClear',
    ]);
    this.callDelegate = setupDelegate(props.delegate);
  }

  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
    window.addEventListener('beforeunload', this.saveToCache);
  }
  componentDidUpdate() {
    if (this._loadedWay) {
      this.focusNavInput();
      this._loadedWay = false;
    }
  }

  componentWillUnmount() {
    if (!this._didAdd) {
      this.saveToCache();
    }
    window.removeEventListener('beforeunload', this.saveToCache);
    this._unmounted = true;
  }

  onHandoffChange(handoff) {
    this.updateState({ handoff });
  }
  onInputChange(e) {
    this.updateState({ title: e.target.value });
  }
  onClear() {
    this.setState(initialState.toObject());
  }
  onFlag(id) {
    let { flags } = this.state;
    if (flags.includes(id)) {
      flags = flags.filter(f => f !== id);
    } else {
      flags = flags.push(id);
    }
    this.setState({ flags });
  }
  onLoadWay(e) {
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
          flags: goal.get('attachment_order'),
          attachmentOrder: goal.get('attachment_order'),
          title: way.get('title'),
        };
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
  onTitleKeyUp(e) {
    if (e.keyCode === 13 && this.isReadyToCreate()) {
      this.clickedAdd();
    }
  }
  onAddedStep(title, index) {
    let { steps, stepOrder } = this.state;
    const id = randomString(6);
    steps = steps.set(id, fromJS({
      id,
      title,
      assignees: [],
    }));
    if (typeof index === 'number') {
      stepOrder = stepOrder.insert(index, id);
    } else {
      stepOrder = stepOrder.push(id);
    }

    this.updateState({ steps, stepOrder });
  }
  onDeletedStep(stepId) {
    let { steps, stepOrder } = this.state;
    steps = steps.delete(stepId);
    stepOrder = stepOrder.filter(id => id !== stepId);
    this.updateState({ steps, stepOrder });
  }
  onOpenAssignee(id, e) {
    this.clickedAssign(id, e);
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
    let { attachments, attachmentOrder, flags } = this.state;
    attachments = attachments.set(obj.shortUrl, fromJS(obj));
    attachmentOrder = attachmentOrder.push(obj.shortUrl);
    flags = flags.push(obj.shortUrl);
    if (!this._unmounted) {
      this.updateState({ attachments, attachmentOrder, flags });
    } else {
      const { saveCache } = this.props;
      saveCache('add-goal', fromJS(Object.assign({}, this.state, {
        attachments,
        attachmentOrder,
        flags,
      })));
    }
  }
  onRemoveAttachment(id) {
    let { attachments, attachmentOrder } = this.state;
    attachments = attachments.delete(id);
    attachmentOrder = attachmentOrder.filter(a => a !== id);
    this.updateState({ attachments, attachmentOrder });
  }
  onTemplateClick(template) {
    const steps = {};
    const stepOrder = [];
    template.steps.forEach((title, i) => {
      const id = `step-${i}`;
      steps[id] = {
        id,
        title,
        assignees: [],
      };
      stepOrder.push(id);
    });
    const newState = fromJS({
      title: template.title,
      steps,
      flags: [],
      stepOrder,
      attachments: {},
      attachmentOrder: [],
    }).toObject();
    this.updateState(newState);
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

  navbarLoadedInput(input) {
    this._input = input;
    this.focusNavInput();
  }
  focusNavInput() {
    if (this._input) {
      const input = this._input;
      input.focus();
      if (input.value.length) {
        input.setSelectionRange(0, input.value.length);
      }
    }
  }
  updateState(newState) {
    this.setState(newState);
  }
  saveToCache() {
    const { saveCache } = this.props;
    const { state } = this;
    const cache = {
      title: state.title,
      handoff: state.handoff,
      flags: state.flags,
      steps: state.steps,
      stepOrder: state.stepOrder,
      attachments: state.attachments,
      attachmentOrder: state.attachmentOrder,
    };
    saveCache('add-goal', fromJS(cache));
  }
  clickedAssign(id, e) {
    const { selectAssignees } = this.props;
    const { steps, stepOrder } = this.state;
    const i = stepOrder.findKey(v => v === id);
    return selectAssignees({
      actionLabel: 'Done',
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
    const { title } = this.state;
    return (title.length);
  }

  clickedAdd() {
    const {
      handoff,
      flags,
    } = this.state;
    const {
      organization_id,
      addGoal,
      removeCache,
      navPop,
    } = this.props;

    const goal = this.getGoal();
    this.setState({ isSubmitting: true, errorLabel: null });
    addGoal(goal, organization_id, handoff, flags.toJS()).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Created goal');
        this._didAdd = true;
        removeCache('add-goal');
        navPop();
      } else {
        this.setState({ isSubmitting: false, errorLabel: 'Something went wrong' });
      }
    });
  }
  renderClearButton() {
    const hasTitle = this.state.title.length > 0;
    const hasAttachments = this.state.attachments.size > 0;
    const hasSteps = this.state.steps.size > 0;
    const hasHandoff = this.state.handoff.length > 0;

    if (hasTitle || hasAttachments || hasSteps || hasHandoff) {
      return <Button text="Clear Fields" tabIndex={-1} onClick={this.onClear} />;
    }

    return undefined;
  }
  renderNavbar() {
    const { target } = this.props;
    const { title } = this.state;

    return (
      <div className="add-goal__header">
        <HOCHeaderTitle
          onChange={this.onInputChange}
          target={target}
          delegate={this}
          onKeyDown={this.onTitleKeyUp}
          value={title}
          placeholder="Write the goal title"
        >
          {this.renderClearButton()}
          <Button text="Load a Way" tabIndex={-1} onClick={this.onLoadWay} />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderSteps() {
    const { steps, stepOrder } = this.state;
    if (!this.isReadyToCreate()) {
      return undefined;
    }
    return (
      <Section title="Steps">
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
    const { attachments, attachmentOrder, flags } = this.state;

    if (!this.isReadyToCreate()) {
      return undefined;
    }

    return (
      <Section className="add-goal__attachment" title="Attachments">
        <HOCAttachments
          attachments={attachments}
          attachmentOrder={attachmentOrder}
          enableFlagging
          flags={flags}
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

    return (
      <Section title="Goal Message">
        <HandoffWriteMessage
          placeholder="Write a message to motivate everyone working on the goal. Add a goal description."
          text={handoff}
          userId={me.get('id')}
          onChange={this.onHandoffChange}
        />
      </Section>
    );
  }
  renderTemplates() {
    if (this.isReadyToCreate()) {
      return undefined;
    }

    const templates = [
      {
        title: 'Content',
        steps: ['Idea', 'Research topic', 'Write content', 'Feedback', 'Publish'],
        description: 'New blog post in making? Easily collaborate on any content idea and get it out of the door.',
      },
      {
        title: 'Event',
        steps: ['Idea', 'Attendees list', 'Agenda', 'Spread the word', 'Food and drinks'],
        description: 'Muffin Friday in the office? Or planning a teamwork event? 5 steps to get you started and involve the right people.',
      },
      {
        title: 'Design',
        steps: ['Concept & specs', 'Visual research', 'Design mockup', 'Feedback', 'Production ready'],
        description: 'Swiftly execute on a design idea with your team, get feedback and bring it to life.',
      },
      {
        title: 'Research',
        steps: ['Topic of research', 'Existing information', 'Gather data', 'Analytize information', 'Share results', 'Get feedback'],
        description: 'Work together on new opportunities, research ideas and share them with the team.',
      },
      {
        title: 'Development',
        steps: ['Specs', 'Development', 'Testing', 'QA'],
        description: 'Make things happen with your team. Collaborate on product improvements and implement new solutions.',
      },
    ];

    return (
      <Section title="Or choose a way">
        <div className="add-goal__templates">
          {templates.map((t, i) => (
            <TemplateItem delegate={this} template={t} key={i} />
          ))}
        </div>
      </Section>
    );
  }
  renderFooter() {
    const { steps, isSubmitting, errorLabel } = this.state;
    let saveButton;
    if (this.isReadyToCreate() && steps.size) {
      saveButton = (
        <Button
          text="Save as a Way"
          className="add-goal__btn add-goal__btn--save"
          onClick={this.onSave}
        />
      );
    }

    return (
      <div className="add-goal__footer">
        <div className="add-goal__actions">
          {saveButton}
          <Button
            text="Create Goal"
            primary
            disabled={!this.isReadyToCreate()}
            className="add-goal__btn add-goal__btn--cta"
            errorLabel={errorLabel}
            loading={isSubmitting}
            onClick={this.clickedAdd}
          />
        </div>
      </div>
    );
  }
  render() {
    let infoClass = 'add-goal__info';

    if (this.isReadyToCreate()) {
      infoClass += ' add-goal__info--show';
    }

    return (
      <SWView header={this.renderNavbar()} footer={this.renderFooter()}>
        <div className="add-goal">
          {this.renderSteps()}
          <div className={infoClass}>
            {this.renderAttachments()}
          </div>
          {this.renderHandoff()}
          {this.renderTemplates()}
        </div>
      </SWView>
    );
  }
}

const { func, object, string } = PropTypes;

HOCAddGoal.propTypes = {
  delegate: object,
  navPop: func,
  target: string,
  removeCache: func,
  addGoal: func,
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
    cache: state.getIn(['cache', 'add-goal']),
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
  };
}

export default connect(mapStateToProps, {
  selectAssignees: actions.goals.selectAssignees,
  saveCache: cache.save,
  removeCache: cache.remove,
  addGoal: actions.goals.addGoal,
  loadWay: actions.ways.load,
  saveWay: actions.ways.save,
})(HOCAddGoal);
