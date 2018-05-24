import React, { PureComponent } from 'react';
import { setupDelegate, setupCachedCallback } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import GoalAdd from '../../goals/goal-components/goal-add/GoalAdd';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import InfoButton from 'components/info-button/InfoButton';
import DroppableGoalList from 'components/draggable-goal/DroppableGoalList';
import { styleElement } from 'swiss-react';
import styles from './PlanOverview.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Footer = styleElement('div', styles.Footer);
const Title = styleElement('div', styles.Title);
const Section = styleElement('div', styles.Section);
const SectionTitle = styleElement('div', styles.SectionTitle);
const SectionTabLikeTitle = styleElement('div', styles.SectionTabLikeTitle);
const Text = styleElement('div', styles.Text);
const Spacer = styleElement('div', styles.Spacer);
const EmptyStateWrapper = styleElement('div', styles.EmptyStateWrapper);
const DroppableWrapper = styleElement('div', styles.DroppableWrapper);
const TabWrapper = styleElement('div', styles.TabWrapper);

class PlanOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyStateOpacity: 1,
      tabs: ['Later', 'Done'],
      activeTabIndex: 1,
    };
    this.renderEmptyStateCached = setupCachedCallback(this.renderEmptyState, this);
    setupDelegate(this, 'onAddGoals', 'onContext', 'onDiscuss', 'onScroll', 'onStepSort');
  }
  getNumberOfAllGoals() {
    const { groupedGoals } = this.props;
    let numberOfGoals = 0;

    const calculateAll = groupedGoals.map((gG) => {
      numberOfGoals = numberOfGoals + gG.size;
    })

    return numberOfGoals;
  }
  tabDidChange(key, i) {
    if(i !== this.state[key]) {
      const activeTabIndex = i; 

      this.setState({
        activeTabIndex,
        [key]: i,
      });
    }
  }
  renderHeader() {
    const { milestone: m, getLoading, delegate, showLine } = this.props;
    const title = getLoading('title').loading;

    return (
      <Wrapper>
        <HOCHeaderTitle
          title={title || m.get('title')}
          delegate={delegate}
          border={showLine}>
          <HOCDiscussButton
            context={{
              id: m.get('id'),
              title: m.get('title'),
            }}
            relatedFilter={msgGen.milestones.getRelatedFilter(m)}
          />
          <InfoButton
            delegate={delegate}
            {...getLoading('dots')}
          />
        </HOCHeaderTitle>
      </Wrapper>
    );
  }
  renderEmptyState(group, isDraggingOver) {
    const { order } = this.props;

    if (group === 'Later' && !order.get('later').size) {
      return (
        <EmptyStateWrapper hidden={isDraggingOver}>
          <Title>
            Set for later
          </Title>
          <Text>
            Move goals that need to be done later <br />  from this week into here.
          </Text>
        </EmptyStateWrapper>
      )
    }

    if (group === 'Done' && !order.get('done').size) {
      return (
        <EmptyStateWrapper hidden={isDraggingOver}>
          <Title>
            TRACK PROGRESS
          </Title>
          <Text>
            You will see the progress of all completed <br /> goals here
          </Text>
        </EmptyStateWrapper>
      )
    }

    return undefined;
  }
  renderDroppableList(section, options = {}) {
    const { order, delegate, milestone } = this.props;
    const {
      renderSection = true,
      rebderTabLikeSection = false,
    } = options;
    const id = section.toLowerCase();
    const goalProps = {
      delegate,
      status: section,
    };
    const droppableGoalList = (
      <DroppableGoalList
        droppableId={id}
        items={order.get(id)}
        renderEmptyState={this.renderEmptyStateCached(section)}
        goalProps={goalProps}
      >
        {section === 'Now' && (
          <GoalAdd delegate={delegate} milestoneId={milestone.get('id')} />
        )}
      </DroppableGoalList>
    );

    if (renderSection) {
      return (
        <DroppableWrapper>
          <Section>
            <SectionTitle>{section}</SectionTitle>
            {droppableGoalList}
          </Section>
        </DroppableWrapper>
      )
    }

    if (rebderTabLikeSection) {
      return (
        <Section>
          <SectionTabLikeTitle>{section}</SectionTabLikeTitle>
          {droppableGoalList}
        </Section>        
      )
    }

    return (
      <Section withTabs>
        {droppableGoalList}
      </Section>
    )
  }
  renderDualTabs() {
    const { viewWidth } = this.props;

    if (viewWidth >= 1100) {
      return undefined;
    }

    const { tabs, activeTabIndex } = this.state;
    const delegate = { tabDidChange: (i) => this.tabDidChange('activeTabIndex', i) };

    return (
      <TabWrapper>
        <Wrapper>
          {this.renderDroppableList('Now', {renderSection: false, rebderTabLikeSection: true})}
        </Wrapper>
        <Spacer />
        <Wrapper withTabs>
          <TabBar tabs={tabs} delegate={delegate} activeTab={activeTabIndex} />
          {this.renderDroppableList(tabs[activeTabIndex], {renderSection: false})}
        </Wrapper>
      </TabWrapper>
    )
  }
  renderThreeSections() {
    const { viewWidth } = this.props;

    if (viewWidth < 1100) {
      return undefined;
    }

    return (
      <TabWrapper>
        {this.renderDroppableList('Later')}
        <Spacer />
        {this.renderDroppableList('Now')}
        <Spacer />
        {this.renderDroppableList('Done')}
      </TabWrapper>
    );
  }
  render() {
    const { milestone } = this.props;

    if (!milestone) return null;

    return (
      <SWView
        header={this.renderHeader()}
        onScroll={this.onScroll}>
        {this.renderThreeSections()}
        {this.renderDualTabs()}
      </SWView>
    );
  }
}

export default PlanOverview;
