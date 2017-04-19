import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import Section from 'components/section/Section';
import Button from 'Button';
import Icon from 'Icon';

import './styles/milestone-overview.scss';

class MilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderHeader() {
    const { milestone: m } = this.props;

    return (
      <div className="milestone-overview__header">
        <HOCHeaderTitle title={m.get('title')}>
          <Button primary text="Add goal to this milestone" />
          <Button icon="ThreeDots" />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderLeftSection() {
    const { milestone, delegate, tabs, tabIndex } = this.props;
    return (
      <section>
        <TabBar
          tabs={tabs}
          activeTab={tabIndex}
          delegate={delegate}
        />
        {milestone.get('goal_order').map(gId => (
          <HOCGoalListItem
            goalId={gId}
            key={gId}
            delegate={delegate}
          />
        ))}
      </section>
    );
  }
  renderRightSection() {
    return (
      <section>
        <Section title="Progress">
          <div className="milestone-progress">
            <div className="milestone-progress__subtitle">6/9</div>
            <Icon icon="MilestoneProgress" className="milestone-progress__svg milestone-progress__svg--bg" />
            <Icon icon="MilestoneProgress" className="milestone-progress__svg milestone-progress__svg--fg" />

            <div className="milestone-progress__inner">
              <div className="milestone-progress__dot" />
              <div className="milestone-progress__number">25%</div>
            </div>
          </div>
        </Section>
      </section>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="milestone-overview">
          {this.renderLeftSection()}
          {this.renderRightSection()}
        </div>
      </SWView>
    );
  }
}

export default MilestoneOverview;

// const { string } = PropTypes;

MilestoneOverview.propTypes = {};
