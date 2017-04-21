import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import Section from 'components/section/Section';
import Button from 'Button';
import Icon from 'Icon';

import './styles/milestone-overview.scss';

const PROGRESS_DASH = 320.4876403808594;

class MilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onAddGoals', 'onContext');
  }
  componentDidMount() {
  }
  renderHeader() {
    const { milestone: m, getLoading, delegate } = this.props;
    const title = getLoading('title').loadingLabel;
    return (
      <div className="milestone-overview__header">
        <HOCHeaderTitle title={title || m.get('title')} delegate={delegate}>
          <Button
            primary
            onClick={this.onAddGoals}
            {...getLoading('add')}
            text="Add goal to this milestone"
          />
          <Button
            icon="ThreeDots"
            onClick={this.onContext}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderLeftSection() {
    const { milestone, delegate, tabs, tabIndex, goals } = this.props;
    const tab = tabs[tabIndex];
    const goalList = goals.get(tab);
    console.log(goals.get('Current'));
    return (
      <section>
        <TabBar
          tabs={tabs.map((t) => {
            const size = goals.get(t).size;
            if (size) {
              t += ` (${size})`;
            }
            return t;
          })}
          activeTab={tabIndex}
          delegate={delegate}
        />

        {this.renderList()}
      </section>
    );
  }
  renderList() {
    const { delegate, tabs, tabIndex, goals } = this.props;
    const tab = tabs[tabIndex];
    const goalList = goals.get(tab);

    if (!goalList.size) {
      return this.renderEmptyState();
    }

    return (
      goalList.map(g => (
        <HOCGoalListItem
          goalId={g.get('id')}
          key={g.get('id')}
          delegate={delegate}
        />
      ))
    );
  }
  renderEmptyState() {
    const { tabs, tabIndex, goals } = this.props;
    const tab = tabs[tabIndex];
    const goalList = goals.get(tab);

    if (tabIndex === 0 && !goalList.size && goals.get('Completed').size) {
      return (
        <div className="milestone-empty">
          <div className="milestone-empty__content">
            Great work on this milestone! All goals have been completed. <br />
            Add a new goal to continue the work or close the milestone as completed.
          </div>
        </div>
      );
    }

    return (
      <div className="milestone-empty">
        <div className="milestone-empty__content">
          Great milestone! What are the goals that will help you and your team achieve it?
          <div className="milestone-empty__action" onClick={this.onAddGoals}>Add goals to this milestone</div>
        </div>
      </div>
    );
  }
  renderRightSection() {
    const { milestone, goals } = this.props;

    const noCompleted = goals.get('Completed').size;
    const noGoals = noCompleted + goals.get('Current').size;
    const percentage = noGoals ? parseInt((noCompleted / noGoals) * 100, 10) : 0;

    const svgDashOffset = PROGRESS_DASH - ((PROGRESS_DASH * percentage) / 100);

    let progressClassName = 'milestone-progress__svg milestone-progress__svg--fg';

    if (milestone.get('closed')) {
      progressClassName += ' milestone-progress__svg--closed';
    }

    return (
      <section>
        <Section title="Progress">
          <div className="milestone-progress">
            <div className="milestone-progress__subtitle">{`${noCompleted} / ${noGoals}`}</div>
            <Icon icon="MilestoneProgress" className="milestone-progress__svg milestone-progress__svg--bg" />
            <Icon
              icon="MilestoneProgress"
              className={progressClassName}
              strokeDasharray={PROGRESS_DASH}
              strokeDashoffset={svgDashOffset}
            />

            <div className="milestone-progress__inner">
              <div className="milestone-progress__dot" />
              <div className="milestone-progress__number">{`${percentage}%`}</div>
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
