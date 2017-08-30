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
    this.state = {};
    setupDelegate(this, 'onAddGoals', 'onContext', 'onDiscuss');
  }
  componentDidMount() {
  }
  renderHeader() {
    const { milestone: m, getLoading, delegate } = this.props;
    const title = getLoading('title').loadingLabel;
    return (
      <div className="milestone-overview__header">
        <HOCHeaderTitle
          title={title || m.get('title')}
          delegate={delegate}
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
  renderLeftSection() {
    return (
      <section>
        <Section title="This week">
          {this.renderList('Current')}
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
        </Section>
        <Section title="Completed">
          {this.renderList('Completed')}
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
