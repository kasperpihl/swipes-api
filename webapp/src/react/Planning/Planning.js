import React from 'react';
import { connect } from 'react-redux';

import SW from './Planning.swiss';
import useWeekSelect from './useWeekSelect';
import useOrgTabs from './useOrgTabs';
import CardHeader from '_shared/Card/Header/CardHeader';
import CardContent from '_shared/Card/Content/CardContent';
import Spacing from '_shared/Spacing/Spacing';
import PlanningSide from './Side/PlanningSide';
import PlanningOverview from './Overview/PlanningOverview';
import TabBar from '_shared/TabBar/TabBar';

export default connect(state => ({
  organizations: state.organizations
}))(Planning);

function Planning({ organizations }) {
  const [weeks, weekIndex, setWeekIndex] = useWeekSelect();

  const [tabs, tabIndex, setTabIndex] = useOrgTabs(organizations);

  const [title, selectedWeek] = weeks[weekIndex];

  const yearWeek = `${selectedWeek.year()}-${selectedWeek.week()}`;
  const ownedBy = tabs[tabIndex].id;

  return (
    <SW.ParentWrapper>
      <SW.LeftSide>
        <CardContent
          header={<CardHeader title="Planning" horizontalPadding={12} />}
          noframe
        >
          <Spacing height={12} />
          <PlanningSide
            weeks={weeks}
            weekIndex={weekIndex}
            setWeekIndex={setWeekIndex}
          />
        </CardContent>
      </SW.LeftSide>
      <SW.RightSide>
        <CardContent
          header={
            <>
              {/* <CardHeader title={title} />
              <Spacing height={12} /> */}
              <TabBar
                tabs={tabs.map(t => t.title)}
                value={tabIndex}
                onChange={i => setTabIndex(i)}
              />
            </>
          }
        >
          <PlanningOverview
            key={`${ownedBy}-${yearWeek}`}
            selectedWeek={selectedWeek}
            ownedBy={ownedBy}
            yearWeek={yearWeek}
          />
        </CardContent>
      </SW.RightSide>
    </SW.ParentWrapper>
  );
}
