import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
// import Icon from 'Icon';
import HOCMilestoneItem from './HOCMilestoneItem';
import AddMilestone from './AddMilestone';

import './styles/milestone-list.scss';

class MilestoneList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onAddGoal', 'onAddMilestone');
  }
  componentDidMount() {
  }
  renderHeader() {
    const { getLoading, tabs, tabIndex, delegate } = this.props;
    return (
      <div className="milestone-list__header">
        <HOCHeaderTitle title="Plan">
          <Button
            text="Add a milestone"
            primary
            {...getLoading('add')}
            onClick={this.onAddMilestone}
          />
        </HOCHeaderTitle>

        <TabBar delegate={delegate} tabs={tabs} activeTab={tabIndex} />
      </div>
    );
  }
  renderList() {
    const { milestones, delegate } = this.props;
    return milestones.map(m => (
      <HOCMilestoneItem
        key={m.get('id')}
        milestone={m}
        delegate={delegate}
      />
    )).toArray();
  }
  renderAddMilestone() {
    return (
      <AddMilestone
        delegate={this}
      />
    )
  }
  renderEmptyState() {
    const { tabIndex } = this.props;

    return (
      <div className="milestone-empty">
        <div className="milestone-empty__content">
          {tabIndex === 0 ?
            'This is the beginning of something great, a project or a big achievement for the team. Add your first milestone and set the goals for it.' :
            'Shhh, the team is hard at work and things are still in progress. No closed milestones yet.'}
          <div className="milestone-empty__action" onClick={this.onAddMilestone}>{tabIndex === 0 ? 'Add a milestone' : ''}</div>
        </div>
      </div>
    );
  }
  render() {
    const { milestones } = this.props;
    return (
      <SWView noframe header={this.renderHeader()}>
        {
          milestones.size ? (
            <div className="milestone-list">
              {this.renderList()}
              {this.renderAddMilestone()}
            </div>
          ) : (
            this.renderEmptyState()
          )
        }
      </SWView>
    );
  }
}

export default MilestoneList;

// const { string } = PropTypes;

MilestoneList.propTypes = {};
