import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';

import Button from 'Button';
import { fromJS } from 'immutable';
import { setupDelegate, bindAll } from 'classes/utils';

import HOCAttachments from 'components/attachments/HOCAttachments';
import AddGoalList from './AddGoalList';
import StepSection from '../goals/goal-step/StepSection';

import './styles/add-goal.scss';

const initialState = fromJS({
  title: '',
  fieldSize: 0,
  attachments: [],
  addAssignees: [],
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

    bindAll(this, ['clickedAdd', 'onTitleChange']);
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
  onUpdatedFieldSize(fieldSize) {
    this.setState({ fieldSize });
  }
  onAddAttachment(obj) {
    let { attachments } = this.state;
    attachments = attachments.push(fromJS(obj));
    this.setState({ attachments });
  }
  clickedAdd() {
    const { steps, title } = this.state;
    const { organization_id, request, addToasty, updateToasty, navPop } = this.props;
    const goal = {
      steps: steps.toJS(),
      title,
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
  renderList() {
    return (
      <AddGoalList
        delegate={this}
      />
    );
  }
  renderAttachments() {
    const { attachments, fieldSize } = this.state;

    if (!fieldSize) {
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
    const { fieldSize } = this.state;

    if (!fieldSize) {
      return undefined;
    }

    return (
      <StepSection title="Handoff" />
    );
  }
  getStatus() {
    const { fieldSize, title } = this.state;
    let status;

    if (!title || !title.length) {
      status = 'Please write a title for your goal';
    } else if (!fieldSize) {
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
        <div className="add-goal__footer">
          {statusHtml}
          <div className="add-goal__actions">
            <Button text="Cancel" className="add-goal__btn add-goal__btn--cancel" />
            <Button text="Create Goal" primary disabled={disabled} className="add-goal__btn add-goal__btn--cta" />
          </div>
        </div>
      </StepSection>
    );
  }
  render() {
    const { isAdding, fieldSize } = this.state;
    let infoClass = 'add-goal__info';

    if (fieldSize) {
      infoClass += ' add-goal__info--show';
    }

    return (
      <div className="add-goal">
        {this.renderHeader()}
        {this.renderList()}
        <div className={infoClass}>
          {this.renderHandoff()}
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
  navPop: actions.navigation.pop,
  request: actions.api.request,
  addToasty: actions.toasty.add,
  updateToasty: actions.toasty.update,
})(HOCAddGoal);
