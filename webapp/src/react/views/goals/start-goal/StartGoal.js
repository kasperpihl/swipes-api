import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import WorkflowList from './WorkflowList';


class StartGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['didSelectItem', 'openStore', 'openCreatePattern']);
  }
  openStore() {

  }
  openCreatePattern() {

  }
  didSelectItem(id) {
    const { workflows, navPush } = this.props;
    navPush({ component: 'ConfirmGoal', title: 'Confirm', props: { data: workflows.get(id).toJS() } });
  }
  renderList() {
    const { workflows } = this.props;
    const filteredWorkflows = [];

    workflows.forEach((i) => {
      if (!i.get('parent_id')) {
        filteredWorkflows.push(i.toJS());
      }
    });

    return <WorkflowList data={filteredWorkflows} callback={this.didSelectItem} />;
  }
  render() {
    return this.renderList();
  }
}

const { func } = PropTypes;

StartGoal.propTypes = {
  workflows: map,
  navPush: func,
};

function mapStateToProps(state) {
  return {
    workflows: state.get('workflows'),
  };
}

const ConnectedStartGoal = connect(mapStateToProps, {
  navPush: actions.navigation.push,
})(StartGoal);

export default ConnectedStartGoal;
