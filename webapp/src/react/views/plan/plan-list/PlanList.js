import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'react-swiss';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import TabBar from 'components/tab-bar/TabBar';
import Icon from 'Icon';
import Button from 'src/react/components/button/Button2';
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
  renderList() {
    const { plans, delegate, tabIndex, limit } = this.props;
    let i = 0;

    return (
      <Dropper droppableId="attachments" type="attachment">
        {plans.map((p => (i++ <= limit) ? (
          <Dragger
            draggableId={p.get('id')}
            index={i - 1}
            key={p.get('id')}>
              <PlanListItem
                plan={p}
                delegate={delegate}
              />
            </Dragger>
          ) : null
        )).toArray()}
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
