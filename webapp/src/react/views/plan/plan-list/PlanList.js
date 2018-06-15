import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import EmptyState from '../../../components/empty-state/EmptyState';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';
import PlanListItem from '../plan-components/plan-list-item/PlanListItem';
import InfoButton from 'components/info-button/InfoButton';
import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';
import SW from './PlanList.swiss';

class PlanList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAddGoal', 'onScroll', 'onAddPlan');
  }
  renderHeader() {
    const { tabs, tabIndex, delegate } = this.props;
    return (
      <SW.HeaderWrapper>
        <HOCHeaderTitle
          title="Plan"
          subtitle="Organize and see progress on your company's plans.">
          <InfoButton delegate={delegate} />
        </HOCHeaderTitle>
        <TabBar key="2" delegate={delegate} tabs={tabs} activeTab={tabIndex} />
      </SW.HeaderWrapper>
    );
  }
  renderFooter() {
    const { getLoading } = this.props;

    return (
      <SW.Footer>
        <Button
          icon="Plus"
          sideLabel="Create new plan"
          onClick={this.onAddPlan}
          {...getLoading('add')}
        />
      </SW.Footer>
    )
  }

  renderOrderedPlanList() {
    const {
      plans,
      plansOrder,
      optimist,
      limit,
      delegate,
    } = this.props;
    const order = optimist.get('milestone_order', plansOrder);
    let i = 0;

    return order.map((planId) => {
      if (i++ <= limit) {
        const plan = plans.find(p => p.get('id') === planId);

        return (
          <Dragger
            draggableId={plan.get('id')}
            index={i - 1}
            key={plan.get('id')}>
              <PlanListItem
                plan={plan}
                delegate={delegate}
              />
          </Dragger>
        )
      } else {
        return null;
      }
    }).toArray()
}
  renderArchivedPlanList() {
    const {
      plans,
      limit,
      delegate,
    } = this.props;
    let i = 0;

    return plans.map((p => (i++ <= limit) ? (
      <PlanListItem
        key={p.get('id')}
        plan={p}
        delegate={delegate}
      />
      ) :
      <EmptyState
        icon = 'ESMilestoneAchieved'
        title="The hall of fame!"
        description={`Seems like your team is sweating on getting their \n first plan completed. \n All completed plans can be found here.`}
      />
    )).toArray()
  }
  renderList() {
    const { tabIndex } = this.props;

    return (
      <Dropper droppableId="plans" type="plan">
        {
          tabIndex === 0 ?
            this.renderOrderedPlanList() :
            this.renderArchivedPlanList()
        }
      </Dropper>
    )
  }

  render() {
    const { initialScroll } = this.props;

    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
        onScroll={this.onScroll}
        initialScroll={initialScroll}
      >
        <SW.Wrapper>
          {this.renderList()}
        </SW.Wrapper>
      </SWView>
    );
  }
}

export default PlanList;
