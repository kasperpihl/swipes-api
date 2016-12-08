import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import Button from 'components/swipes-ui/Button';
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
    navPush({ component: 'ConfirmGoal', title: 'Confirm Goal', props: { data: workflows.get(id).toJS() } });
  }
  renderList() {
    const { workflows } = this.props;
    const filteredWorkflows = [];

    workflows.toArray().forEach((i) => {
      if (!i.get('parent_id')) {
        filteredWorkflows.push(i.toJS());
      }
    });

    return <WorkflowList data={filteredWorkflows} callback={this.didSelectItem} />;
  }
  render() {
    return (
      <div className="start-goal" style={{ height: '100%' }}>
        {this.renderList()}
        <Button callback={this.openStore} title="Go to store" style={{ position: 'fixed', bottom: '60px', right: '30px' }} />
      </div>
    );
  }
}

const { func } = PropTypes;

StartGoal.propTypes = {
  workflows: map,
  loadModal: func,
  navPush: func,
  users: map,
};

function mapStateToProps(state) {
  return {
    workflows: state.get('workflows'),
    users: state.get('users'),
  };
}

const ConnectedStartGoal = connect(mapStateToProps, {
  loadModal: actions.modal.load,
  navPush: actions.navigation.push,
})(StartGoal);

export default ConnectedStartGoal;
