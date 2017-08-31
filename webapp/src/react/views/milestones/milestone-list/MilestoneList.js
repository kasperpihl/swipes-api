import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Icon from 'Icon';
import HOCMilestoneItem from './HOCMilestoneItem';
import AddMilestone from './AddMilestone';
import HOCNoMilestone from './HOCNoMilestone';
import HOCInfoButton from 'components/info-button/HOCInfoButton';

import './styles/milestone-list.scss';

class MilestoneList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAddGoal');
  }
  componentDidMount() {
  }
  renderHeader() {
    const { getLoading, tabs, tabIndex, delegate } = this.props;
    return (
      <div className="milestone-list__header">
        <HOCHeaderTitle
          title="Plan"
          subtitle="Organize and see progress on your company's milestones."
        >
          <HOCInfoButton
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
          Seems like your team is sweating on getting there <br />
          first milestone completed. <br />
          All completed milestones can be found here.
        </div>
      </div>
    )
  }
  renderList() {
    const { milestones, delegate, tabIndex } = this.props;
    let firstMilestones = tabIndex === 0 ? [<HOCNoMilestone key="no" />] : [];

    if (tabIndex === 1 && milestones && milestones.size < 1) {
      return this.renderEmptyState();
    }

    return firstMilestones.concat(milestones.map(m => (
      <HOCMilestoneItem
        key={m.get('id')}
        milestone={m}
        delegate={delegate}
      />
    )).toArray());
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
    const { milestones, tabIndex } = this.props;
    let className = 'milestone-list';

    if (tabIndex === 1 && milestones && milestones.size < 1) {
      className += ' milestone-list--empty-state'
    }

    return (
      <SWView noframe header={this.renderHeader()}>
        <div className={className}>
          {this.renderList()}
          {this.renderAddMilestone()}
        </div>
      </SWView>
    );
  }
}

export default MilestoneList;

// const { string } = PropTypes;

MilestoneList.propTypes = {};
