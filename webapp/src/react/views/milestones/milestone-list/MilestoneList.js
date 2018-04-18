import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Icon from 'Icon';
import HOCMilestoneItem from './HOCMilestoneItem';
import AddMilestone from './AddMilestone';
import HOCNoMilestone from './HOCNoMilestone';
import InfoButton from 'components/info-button/InfoButton';

import './styles/milestone-list.scss';

class MilestoneList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAddGoal', 'onScroll');
  }
  renderHeader() {
    const { getLoading, tabs, tabIndex, delegate } = this.props;
    return (
      <div className="milestone-list__header">
        <HOCHeaderTitle
          title="Plan"
          subtitle="Organize and see progress on your company's plans."
        >
          <InfoButton
            delegate={delegate}
          />
        </HOCHeaderTitle>

        <TabBar delegate={delegate} tabs={tabs} activeTab={tabIndex} />
      </div>
    );
  }
  renderEmptyState() {

    return (
      <div className="milestone-list__empty-state">
        <div className="milestone-list__empty-illustration">
          <Icon icon="ESMilestoneAchieved" className="milestone-list__empty-svg"/>
        </div>
        <div className="milestone-list__empty-title">
          the hall of fame
        </div>
        <div className="milestone-list__empty-text">
          Seems like your team is sweating on getting their <br />
          first plan completed. <br />
          All completed plans can be found here.
        </div>
      </div>
    )
  }
  renderList() {
    const { milestones, delegate, tabIndex, limit } = this.props;
    let lastMilestones = tabIndex === 0 ? [<HOCNoMilestone key="no" />] : [];

    if (tabIndex === 1 && milestones && milestones.size < 1) {
      return this.renderEmptyState();
    }
    let i = lastMilestones.length;
    return milestones.map(m => (i++ <= limit) ? (
      <HOCMilestoneItem
        key={m.get('id')}
        milestone={m}
        delegate={delegate}
      />
    ) : null).toArray().concat(lastMilestones);
  }
  renderAddMilestone() {
    const { delegate, tabIndex } = this.props;
    if(tabIndex > 0) {
      return undefined;
    }
    return (
      <AddMilestone
        delegate={delegate}
        {...this.props.bindLoading()}
      />
    )
  }
  render() {
    const { milestones, tabIndex, initialScroll } = this.props;
    let className = 'milestone-list';

    if (tabIndex === 1 && milestones && milestones.size < 1) {
      className += ' milestone-list--empty-state'
    }

    return (
      <SWView
        noframe
        header={this.renderHeader()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <div className={className}>
          {this.renderAddMilestone()}
          {this.renderList()}
        </div>
      </SWView>
    );
  }
}

export default MilestoneList;
