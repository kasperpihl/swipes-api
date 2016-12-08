import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { bindAll, setupDelegate } from 'classes/utils';

import TabBar from 'components/tab-bar/TabBar';
import GoalListItem from './GoalListItem';


import './styles/goals-list.scss';

class GoalList extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['now', 'later', 'completed', 'all'];
    this.state = { tabIndex: 0 };
    this.tags = [
      'development',
      'design',
      'v1',
      'beta',
      'bugs',
      'marketing',
      'sales',
      'vacation',
      'team building',
    ];
    this.callDelegate = setupDelegate(props.delegate, this);
    bindAll(this, ['clickedListItem']);
  }
  componentDidMount() {
  }
  clickedListItem(id) {
    this.callDelegate('goalListClickedGoal', id);
  }
  tabDidChange(nav, index) {
    if (this.state.tabIndex !== index) {
      this.setState({ tabIndex: index });
    }
  }
  filterGoals(goals) {
    const { tabIndex } = this.state;

    switch (tabIndex) {
      case 0:
        return this.filterMine(goals);
      case 1:
        return this.filterLater(goals);
      case 2:
        return this.filterCompleted(goals);
      case 3:
        return goals;
      default:
        return this.filterMine(goals);
    }
  }
  filterCompleted(goals) {
    return goals.filter(goal => (goal.get('steps').last().get('completed')));
  }
  filterMine(goals) {
    const {
      me,
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      const currentStep = steps.find(step => step.get('completed') !== true);

      if (!currentStep) {
        return false;
      }

      const assignees = currentStep.get('assignees');
      const containsMe = assignees.find((user) => {
        if (user.get('id') === me.get('id')) {
          return true;
        }

        return false;
      });

      if (!containsMe) {
        return false;
      }

      return true;
    });
  }
  filterLater(goals) {
    const {
      me,
    } = this.props;

    return goals.filter((goal) => {
      const steps = goal.get('steps');
      let indexCompleted = null;
      let match = null;

      const currentStep = steps.findEntry(step => step.get('completed') !== true);

      if (!currentStep) {
        return false;
      }

      indexCompleted = currentStep[0];

      steps.forEach((step, i) => {
        if (i > indexCompleted) {
          const assignees = step.get('assignees');

          const containsMe = assignees.find((user) => {
            if (user.get('id') === me.get('id')) {
              return true;
            }

            return false;
          });

          if (containsMe) {
            match = true;
            // Stop the forEach
            return false;
          }
        }

        return undefined;
      });

      if (match) {
        return true;
      }

      return false;
    });
  }
  renderTabbar() {
    return (
      <div className="goals-list__tab-bar">
        <TabBar tabs={this.tabs} delegate={this} activeTab={this.state.tabIndex} />
      </div>
    );
  }
  renderList() {
    let { goals } = this.props;

    goals = goals.sort((a, b) => b.get('timestamp').localeCompare(a.get('timestamp'))).toArray();
    goals = this.filterGoals(goals);

    return goals.map(goal => <GoalListItem onClick={this.clickedListItem} me={this.props.me} data={goal} key={`goal-list-item-${goal.get('id')}`} />);
  }
  render() {
    return (
      <div className="goals-list">
        {this.renderTabbar()}
        <div className="goals-list__scroller">
          {this.renderList()}
        </div>
      </div>
    );
  }
}

const { func, object } = PropTypes;

GoalList.propTypes = {
  goals: map.isRequired,
  me: map.isRequired,
  delegate: object,
};

export default GoalList;
