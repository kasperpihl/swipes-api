import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import HOCAddGoalItem from 'components/goal-list-item/HOCAddGoalItem';
import Section from 'components/section/Section';
import HOCDiscussButton from 'components/discuss-button/HOCDiscussButton';
import HOCInfoButton from 'components/info-button/HOCInfoButton';
import DroppableGoalList from 'components/draggable-goal/DroppableGoalList';
import FlexWrapper from 'swiss-components/FlexWrapper';
import Wrapper from 'swiss-components/Wrapper';
import { element } from 'react-swiss';

const Title = element({
  _font: ['11px', '$deepBlue80', '18px', 'bold'],
  textTransform: 'uppercase',
  paddingTop: '60px',
});

const Text = element({
  _widthSpecifications: ['initial', '230px'],
  _font: ['12px', '$deepBlue50', '18px', '400'],
  paddingTop: '6px',
  textAlign: 'center',
});


class MilestoneOverview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyStateOpacity: 1,
      tabs: ['Later', 'Now', 'Completed'],
      tabLeftIndex: 0,
      tabRightIndex: 1,
    };
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
          titleIcon="Milestones"
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
      </Wrapper>
    );
  }
  renderEmptyState(group) {
    const { groupedGoals } = this.props;

    if (group === 'Later' && !groupedGoals.get('Later').size) {
      return (
        <FlexWrapper column fill center>
          <Title>
            Set for later
          </Title>
          <Text>
            Move goals that need to be done later <br />  from this week into here.
          </Text>
        </FlexWrapper>
      )
    }

    if (group === 'Completed' && !groupedGoals.get('Completed').size) {
      return (
        <FlexWrapper column fill center>
          <Title>
            TRACK PROGRESS
          </Title>
          <Text>
            You will see the progress of all completed <br /> goals here
          </Text>
        </FlexWrapper>
      )
    }

    return undefined;
  }
  renderDroppableList(section, renderSection) {
    const { order, delegate, milestone } = this.props;
    const id = section.toLowerCase();

    if (renderSection) {
      return (
        <FlexWrapper>
          <Section title={section}>
            <DroppableGoalList droppableId={id} items={order.get(id)}>
              {section === 'Now' && (
                <HOCAddGoalItem delegate={delegate} milestoneId={milestone.get('id')} />
              )}
              
              {this.renderEmptyState(section)}
            </DroppableGoalList>
          </Section>
        </FlexWrapper>
      )
    }

    return (
      <DroppableGoalList droppableId={id} items={order.get(id)}>
        {this.renderEmptyState(section)}
      </DroppableGoalList>
    )
  }
  renderDualTabs() {
    const { viewWidth } = this.props;

    if (viewWidth !== 750) {
      return undefined;
    }

    const { tabs, tabRightIndex, tabLeftIndex } = this.state;
    const lef = { tabDidChange: (i) => this.tabDidChange('tabLeftIndex', i) };
    const rig = { tabDidChange: (i) => this.tabDidChange('tabRightIndex', i) };

    return (
      <FlexWrapper horizontal="between">
        <Wrapper>
          <TabBar tabs={tabs} delegate={lef} activeTab={tabLeftIndex} />
          {this.renderDroppableList(tabs[tabLeftIndex], false)}
        </Wrapper>
        <FlexWrapper width={30} flexNone />
        <Wrapper>
          <TabBar tabs={tabs} delegate={rig} activeTab={tabRightIndex} />
          {this.renderDroppableList(tabs[tabRightIndex], false)}
        </Wrapper>
      </FlexWrapper>
    )
  }
  renderThreeSections() {
    const { viewWidth } = this.props;

    if (viewWidth !== 1100) {
      return undefined;
    }

    return (
      <FlexWrapper horizontal="between">
        {this.renderDroppableList('Later', true)}
        <FlexWrapper width={30} flexNone />
        {this.renderDroppableList('Now', true)}
        <FlexWrapper width={30} flexNone />
        {this.renderDroppableList('Completed', true)}
      </FlexWrapper>
    );
  }
  render() {
    const { milestone } = this.props;

    if (!milestone) return null;

    return (
      <SWView header={this.renderHeader()} onScroll={this.onScroll}>
        {this.renderThreeSections()}
        {this.renderDualTabs()}
      </SWView>
    );
  }
}

export default MilestoneOverview;

// const { string } = PropTypes;

MilestoneOverview.propTypes = {};
