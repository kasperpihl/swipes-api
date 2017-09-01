import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCGoalListItem from 'components/goal-list-item/HOCGoalListItem';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import Section from 'components/section/Section';
import Button from 'Button';
import Icon from 'Icon';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import HOCInfoButton from 'components/info-button/HOCInfoButton';
import './styles/milestone-overview.scss';

class MilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyStateOpacity: 1,
    };
    setupDelegate(this, 'onAddGoals', 'onContext', 'onDiscuss', 'onScroll');
  }
  componentDidMount() {
  }
  getNumberOfAllGoals() {
    const { groupedGoals } = this.props;
    let numberOfGoals = 0;

    const calculateAll = groupedGoals.map((gG) => {
      numberOfGoals = numberOfGoals + gG.size;
    })

    return numberOfGoals;
  }
  onAddGoalItemInputChange(title) {
    const { emptyStateOpacity } = this.state;
    const newEmptyStateOpacity = Math.max((10 - title.length) / 10, 0);

    if (emptyStateOpacity !== newEmptyStateOpacity) {
      this.setState({ emptyStateOpacity: newEmptyStateOpacity })
    }
  }
  renderHeader() {
    const { milestone: m, getLoading, delegate, showLine } = this.props;
    const title = getLoading('title').loadingLabel;
    return (
      <div className="milestone-overview__header">
        <HOCHeaderTitle
          title={title || m.get('title')}
          delegate={delegate}
          border={showLine}
        >
          <HOCDiscussButton
            context={{
              id: m.get('id'),
              title: m.get('title'),
            }}
            relatedFilter={msgGen.milestones.getRelatedFilter(m)}
          />

          <HOCInfoButton
            delegate={delegate}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </div>
    );
  }
  renderEmptyState(group) {
    const { groupedGoals } = this.props;
    const numberOfAllGoals = this.getNumberOfAllGoals();

    if (group === 'Current' && !numberOfAllGoals) {


      return (
        <div className="milestone-overview__empty-state milestone-overview__empty-state--current" style={{ opacity: this.state.emptyStateOpacity }}>
          <div className="milestone-overview__empty-arrow">
            <Icon icon="ESArrow" className="milestone-overview__empty-arrow-svg" />
          </div>
          <div className="milestone-overview__empty-title">
            Add a new goal
          </div>
          <div className="milestone-overview__empty-text">
            Add new goals for everything that needs <br /> to be done to achieve this milestone.
          </div>
        </div>
      )
    }

    if (group === 'Later' && !groupedGoals.get('Later').size) {
      return (
        <div className="milestone-overview__empty-state milestone-overview__empty-state--later">
          <div className="milestone-overview__empty-title">
            Set for later (coming soon)
          </div>
          <div className="milestone-overview__empty-text">
            Move goals that need to be done later <br />  from this week into here.
          </div>
        </div>
      )
    }

    if (group === 'Completed' && !groupedGoals.get('Completed').size) {
      return (
        <div className="milestone-overview__empty-state milestone-overview__empty-state--completed">
          <div className="milestone-overview__empty-title">
            TRACK PROGRESS
          </div>
          <div className="milestone-overview__empty-text">
            You will see the progress of all completed <br /> goals here</div>
        </div>
      )
    }

    return undefined;
  }
  renderLeftSection() {
    return (
      <section>
        <Section title="This week">
          {this.renderList('Current')}
          {this.renderEmptyState('Current')}
        </Section>
      </section>
    );
  }
  renderList(group) {
    const { delegate, groupedGoals, milestone } = this.props;

    let renderedGoals = groupedGoals.get(group).map(g => (
      <HOCGoalListItem
        goalId={g.get('id')}
        key={g.get('id')}
        delegate={delegate}
        fromMilestone={true}
      />
    ));

    if(group === 'Current') {
      renderedGoals = renderedGoals.push(
        <HOCAddGoalItem
          key="add"
          milestoneId={milestone.get('id')}
          delegate={this}
        />
      )
    }
    return renderedGoals;
  }

  renderRightSection() {
    return (
      <section>
        <Section title="Later">
          {this.renderList('Later')}
          {this.renderEmptyState('Later')}
        </Section>
        <Section title="Completed">
          {this.renderList('Completed')}
          {this.renderEmptyState('Completed')}
        </Section>
      </section>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()} onScroll={this.onScroll}>
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
