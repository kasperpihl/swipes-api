import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from 'actions';

import Button from 'Button';
import { fromJS, Map, List } from 'immutable';
import { setupDelegate, bindAll } from 'classes/utils';

import StepItem from './StepItem';
import StepSection from '../goals/goal-step/StepSection';

import './styles/add-goal.scss';

const initialState = fromJS({
  steps: [],
  title: '',
  addAssignees: [],
});

class HOCAddGoal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState.toObject();

    bindAll(this, ['clickedAdd', 'onTitleChange']);
    this.callDelegate = setupDelegate(props.delegate);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.refs.input.focus();
  }
  onTitleChange(e) {
    this.setState({ title: e.target.value });
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
  clickedAssign(i) {
    const { assignModal } = this.props;
    const { addAssignees, steps } = this.state;
    let assignees = addAssignees;

    if (i !== 'add') {
      assignees = steps.getIn([i, 'assignees']);
    }

    return assignModal(
      assignees,
      this.selectedAssignees.bind(this, i),
    );
  }
  selectedAssignees(i, res) {
    if (res) {
      if (i === 'add') {
        this.setState({ addAssignees: fromJS(res) });
      } else {
        const { steps } = this.state;

        this.setState({ steps: steps.setIn([i, 'assignees'], fromJS(res)) });
      }
    }
  }
  updateStepData(i, data) {
    let { addAssignees } = this.state;
    const { steps } = this.state;
    let s;

    if (i === 'add') {
      s = steps.push(Map(data));
      addAssignees = List();
    } else {
      s = steps.set(i, data);
    }

    this.setState({ steps: s, addAssignees });
  }
  // renderHeader() {
  //   const { title } = this.state;
  //
  //   return (
  //     <div className="add-goal__header">
  //       <input
  //         ref="input"
  //         type="text"
  //         className="add-goal__title add-goal__title--input"
  //         placeholder="Name your goal"
  //         onChange={this.onTitleChange}
  //         value={title}
  //       />
  //     </div>
  //   );
  // }
  // renderStepList() {
  //   const { steps, addAssignees } = this.state;
  //
  //   return (
  //     <div className="add-goal__step-list">
  //       {steps.map((s, i) => (
  //         <StepItem
  //           key={i}
  //           index={i}
  //           delegate={this}
  //           title={s.get('title')}
  //           assignees={s.get('assignees')}
  //         />
  //       ))}
  //       <StepItem
  //         key="add"
  //         add
  //         delegate={this}
  //         assignees={addAssignees}
  //       />
  //     </div>
  //   );
  // }
  renderHeader() {
    return (
      <div className="add-goal__header">
        <input type="text" className="add-goal__title" placeholder="Goal Name" />
        <Button icon="ThreeDots" className="add-goal__btn add-goal__btn--context" />
      </div>
    );
  }
  renderList() {
    return (
      <StepSection title="Steps">
        <div className="step">
          <div className="step__header">
            <div className="step__title">1. Create Specs</div>
            <div className="step__actions">
              <Button icon="Person" className="step__btn step__btn--add-person" />
              <Button icon="Note" className="step__btn step__btn--note" />
              <Button icon="Trash" className="step__btn step__btn--trash" />
            </div>
          </div>
          <div className="step__assignees">
            Stefan V.
          </div>
        </div>
        <div className="step">
          <div className="step__header">
            <div className="step__title">2. Lorem ipsum dolor sit amet, consectetur adipisicing elit</div>
            <div className="step__actions">
              <Button icon="Person" className="step__btn step__btn--add-person" />
              <Button icon="Note" className="step__btn step__btn--note" />
              <Button icon="Trash" className="step__btn step__btn--trash" />
            </div>
          </div>
          <div className="step__assignees">
            Stefan V.
          </div>
        </div>
      </StepSection>
    );
  }
  renderHandoff() {
    return (
      <StepSection title="Handoff" />
    );
  }
  renderActions() {

  }
  render() {
    const { isAdding } = this.state;

    return (
      <div className="add-goal">
        {this.renderHeader()}
        {this.renderList()}
        {this.renderHandoff()}
        {this.renderActions()}
      </div>
    );

    // return (
    //   <div className="add-goal">
    //     <div className="add-goal__wrapper">
    //       {this.renderHeader()}
    //       {this.renderStepList()}
    //       <Button text="Add Goal" disabled={isAdding} onClick={this.clickedAdd} primary />
    //     </div>
    //   </div>
    // );
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
