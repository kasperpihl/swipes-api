import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Button from 'Button';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
// import Icon from 'Icon';
import MilestoneItem from './MilestoneItem';
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
        <HOCHeaderTitle title="Milestone">
          <Button
            text="Create"
            primary
            {...getLoading('add')}
            onClick={this.onAddMilestone}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="milestone-list">
          {/* {this.renderMilestones()} */}
        </div>
      </SWView>
    );
  }
}

export default MilestoneList;

// const { string } = PropTypes;

MilestoneList.propTypes = {};
