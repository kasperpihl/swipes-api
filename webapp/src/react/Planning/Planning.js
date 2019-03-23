import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import SW from './Planning.swiss';

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
  const defaultYearWeek = useMemo(() => {
    const now = moment();
    return `${now.year()}-${now.week()}`;
  }, []);
  const [yearWeek, setYearWeek] = useState(defaultYearWeek);

  const [tabs, tabIndex, setTabIndex] = useOrgTabs(organizations);

  const ownedBy = tabs[tabIndex].id;

  return (
    <SW.ParentWrapper>
      <SW.LeftSide>
        <CardContent
          header={<CardHeader title="Planning" horizontalPadding={12} />}
          noframe
        >
          <Spacing height={12} />
          <PlanningSide yearWeek={yearWeek} setYearWeek={setYearWeek} />
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
            ownedBy={ownedBy}
            yearWeek={yearWeek}
          />
        </CardContent>
      </SW.RightSide>
    </SW.ParentWrapper>
  );
}
