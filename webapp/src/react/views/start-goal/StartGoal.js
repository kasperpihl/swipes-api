import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { overlay, modal } from '../../actions';
import { bindAll } from '../../classes/utils';

import WorkflowList from '../../components/start-goal/WorkflowList';
import Button from '../../components/swipes-ui/Button';

class StartGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['didSelectItem', 'openStore', 'openCreatePattern']);
  }
  openStore() {
    const { pushOverlay } = this.props;

    pushOverlay({ component: 'Store', title: 'Store' });
  }
  openCreatePattern() {
    const { pushOverlay } = this.props;

    pushOverlay({ component: 'CreatePattern', title: 'Create Pattern' });
  }
  didSelectItem(id) {
    const { pushOverlay, workflows, loadModal, users } = this.props;
    const idToCheck = 'PGR5OHKL6';

    if (workflows.get(id).toJS().id === idToCheck) {
      const filteredWorkspaces = workflows.toArray().filter((x) => {
        if (x.get('id') === idToCheck || x.get('parent_id') === idToCheck) {
          return true;
        }

        return false;
      });

      const mappedItems = filteredWorkspaces.map((x) => {
        let title;
        let img;

        if (x.get('created_by')) {
          title = x.get('title');
          img = users.getIn([x.get('created_by'), 'profile_pic']);
        } else {
          title = 'Company Standard';
          img = {
            element: x.get('img'),
          };
        }

        return {
          title,
          img,
        };
      });

      loadModal({
        title: 'Choose Pattern',
        data: {
          list: {
            items: mappedItems,
            emptyText: 'No patterns found!',
          },
        },
      }, (e) => {
        if (e) {
          pushOverlay({ component: 'ConfirmGoal', title: 'Confirm', props: { data: filteredWorkspaces[e.item] } });
        }
      });
    } else {
      pushOverlay({ component: 'ConfirmGoal', title: 'Confirm', props: { data: workflows.get(id).toJS() } });
    }
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
  pushOverlay: func,
  workflows: map,
  loadModal: func,
  users: map,
};

function mapStateToProps(state) {
  return {
    workflows: state.get('workflows'),
    users: state.get('users'),
  };
}

const ConnectedStartGoal = connect(mapStateToProps, {
  loadModal: modal.load,
  pushOverlay: overlay.push,
})(StartGoal);

export default ConnectedStartGoal;
