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
    const { getLoading } = this.props;
    return (
      <div className="milestone-list__header">
        <HOCHeaderTitle title="Milestones">
          <Button
            text="Create"
            primary
            {...getLoading('add')}
            onClick={this.onAddMilestone}
          />
        </HOCHeaderTitle>

        <TabBar tabs={['Open', 'Closed (coming soon)']} activeTab={0} />
      </div>
    );
  }
  renderList() {
    const { milestones, delegate } = this.props;
    return milestones.map((m) => (
      <HOCMilestoneItem
        key={m.get('id')}
        milestone={m}
        delegate={delegate}
      />
    )).toArray();
  }
  render() {
    return (
      <SWView noframe header={this.renderHeader()}>
        <div className="milestone-list">
          {this.renderList()}
        </div>
      </SWView>
    );
  }
}

export default MilestoneList;

// const { string } = PropTypes;

MilestoneList.propTypes = {};