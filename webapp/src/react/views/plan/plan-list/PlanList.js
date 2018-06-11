import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button';
import PlanListItem from '../plan-components/plan-list-item/PlanListItem';
import InfoButton from 'components/info-button/InfoButton';
import Dropper from 'src/react/components/draggable-list/Dropper';
import Dragger from 'src/react/components/draggable-list/Dragger';
import styles from './PlanList.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const HeaderWrapper = styleElement('div', styles.HeaderWrapper);
const Footer = styleElement('div', styles.Footer);

class PlanList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAddGoal', 'onScroll', 'onAddPlan');
  }
  renderHeader() {
    const { tabs, tabIndex, delegate } = this.props;
    return (
      <HeaderWrapper>
        <HOCHeaderTitle
          title="Plan"
          subtitle="Organize and see progress on your company's plans.">
          <InfoButton delegate={delegate} />
        </HOCHeaderTitle>
        <TabBar key="2" delegate={delegate} tabs={tabs} activeTab={tabIndex} />
      </HeaderWrapper>
    );
  }
  renderFooter() {
    const { getLoading } = this.props;

    return (
      <Footer>
        <Button
          icon="Plus"
          sideLabel="Create new plan"
          onClick={this.onAddPlan}
          {...getLoading('add')}
        />
      </Footer>
    )
  }
  renderEmptyState() {

    return (
      <div className="milestone-list__empty-state">
        <div className="milestone-list__empty-illustration">
          <Icon icon="ESMilestoneAchieved" className="milestone-list__empty-svg"/>
        </div>
        <div className="milestone-list__empty-title">
          the hall of fame
        </div>
        <div className="milestone-list__empty-text">
          Seems like your team is sweating on getting their <br />
          first plan completed. <br />
          All completed plans can be found here.
        </div>
      </div>
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
      ) : null
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
        <Wrapper>
          {this.renderList()}
        </Wrapper>
      </SWView>
    );
  }
}

export default PlanList;
