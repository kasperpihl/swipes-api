import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
// import Icon from 'Icon';
import HOCMilestoneItem from './HOCMilestoneItem';
import AddMilestone from './AddMilestone';
import HOCNoMilestone from './HOCNoMilestone';
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
        <HOCHeaderTitle title="Plan" />

        <TabBar delegate={delegate} tabs={tabs} activeTab={tabIndex} />
      </div>
    );
  }
  renderList() {
    const { milestones, delegate } = this.props;
    return [
      <HOCNoMilestone key="no" />
    ].concat(milestones.map(m => (
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
    const { milestones } = this.props;
    return (
      <SWView noframe header={this.renderHeader()}>
        <div className="milestone-list">
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
