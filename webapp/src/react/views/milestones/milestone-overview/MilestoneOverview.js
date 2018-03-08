import React, { PureComponent } from 'react';
import { setupDelegate, setupCachedCallback } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import HOCInfoButton from 'components/info-button/HOCInfoButton';
import DroppableGoalList from 'components/draggable-goal/DroppableGoalList';
import { element } from 'react-swiss';

import sw from './MilestoneOverview.swiss';

const Wrapper = element('div', sw.Wrapper);
const Footer = element('div', sw.Footer);
const Title = element('div', sw.Title);
const Section = element('div', sw.Section);
const SectionTitle = element('div', sw.SectionTitle);
const Text = element('div', sw.Text);
const Spacer = element('div', sw.Spacer);
const EmptyStateWrapper = element('div', sw.EmptyStateWrapper);
const DroppableWrapper = element('div', sw.DroppableWrapper);
const TabWrapper = element('div', sw.TabWrapper);

class MilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyStateOpacity: 1,
      tabs: ['Later', 'Now', 'Done'],
      tabLeftIndex: 0,
      tabRightIndex: 1,
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
      const reverseKey = key === 'tabLeftIndex' ? 'tabRightIndex' : 'tabLeftIndex';
      let reverseI = this.state[reverseKey];
      if(i === reverseI) {
        reverseI = (i === 0) ? 2 : i - 1;
      }
      this.setState({
        [key]: i,
        [reverseKey]: reverseI,
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
          border={showLine}
        />
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
  renderDroppableList(section, renderSection) {
    const { order, delegate, milestone } = this.props;
    const id = section.toLowerCase();
    const goalProps = {
      delegate,
      status: section,
    };

    if (renderSection) {
      return (
        <DroppableWrapper>
          <Section>
            <SectionTitle>{section}</SectionTitle>
            <DroppableGoalList
              droppableId={id}
              items={order.get(id)}
              renderEmptyState={this.renderEmptyStateCached(section)}
              goalProps={goalProps}
            >
              {section === 'Now' && (
                <HOCAddGoalItem delegate={delegate} milestoneId={milestone.get('id')} />
              )}
            </DroppableGoalList>
          </Section>
          
        </DroppableWrapper>
      )
    }

    return (
      <DroppableGoalList
        droppableId={id}
        items={order.get(id)}
        renderEmptyState={this.renderEmptyStateCached(section)}
        goalProps={goalProps}
      >
        {section === 'Now' && (
          <HOCAddGoalItem delegate={delegate} milestoneId={milestone.get('id')} />
        )}
      </DroppableGoalList>
    )
  }
  renderDualTabs() {
    const { viewWidth } = this.props;

    if (viewWidth >= 1100) {
      return undefined;
    }

    const { tabs, tabRightIndex, tabLeftIndex } = this.state;
    const lef = { tabDidChange: (i) => this.tabDidChange('tabLeftIndex', i) };
    const rig = { tabDidChange: (i) => this.tabDidChange('tabRightIndex', i) };

    return (
      <TabWrapper>
        <Wrapper>
          <TabBar tabs={tabs} delegate={lef} activeTab={tabLeftIndex} />
          {this.renderDroppableList(tabs[tabLeftIndex], false)}
        </Wrapper>
        <Spacer />
        <Wrapper>
          <TabBar tabs={tabs} delegate={rig} activeTab={tabRightIndex} />
          {this.renderDroppableList(tabs[tabRightIndex], false)}
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
        {this.renderDroppableList('Later', true)}
        <Spacer />
        {this.renderDroppableList('Now', true)}
        <Spacer />
        {this.renderDroppableList('Done', true)}
      </TabWrapper>
    );
  }
  renderFooter() {
    const { milestone: m, getLoading, delegate } = this.props;

    return (
      <Footer>
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
      </Footer>
    )
  }
  render() {
    const { milestone } = this.props;

    if (!milestone) return null;

    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
        onScroll={this.onScroll}>
        {this.renderThreeSections()}
        {this.renderDualTabs()}
      </SWView>
    );
  }
}

export default MilestoneOverview;

// const { string } = PropTypes;

MilestoneOverview.propTypes = {};
