import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import SW from './Planning.swiss';

import useTeamTabs from './useTeamTabs';
import CardHeader from '_shared/Card/Header/CardHeader';
import CardContent from '_shared/Card/Content/CardContent';
import Spacing from '_shared/Spacing/Spacing';
import PlanningSide from './Side/PlanningSide';
import PlanningOverview from './Overview/PlanningOverview';
import Button from '_shared/Button/Button';
import TabBar from '_shared/TabBar/TabBar';
import SideHeader from '_shared/SideHeader/SideHeader';
import ProgressBar from '_shared/ProgressBar/ProgressBar';

export default connect(state => ({
  teams: state.teams
}))(Planning);

function Planning({ teams }) {
  const defaultYearWeek = useMemo(() => {
    const now = moment();
    return `${now.year()}-${now.week()}`;
  }, []);
  const [yearWeek, setYearWeek] = useState(defaultYearWeek);

  const [tabs, tabIndex, setTabIndex] = useTeamTabs(teams);

  const ownedBy = tabs[tabIndex].id;

  return (
    <CardContent
      header={
        <SW.HeaderWrapper>
          <CardHeader title="Planning">
            <Button title="Plan next week" icon="Calendar" />
          </CardHeader>
          <Spacing height={12} />
          <TabBar
            tabs={tabs.map(t => t.title)}
            value={tabIndex}
            onChange={i => setTabIndex(i)}
          />
        </SW.HeaderWrapper>
      }
      noframe
    >
      <Spacing height={42} />
      <SW.ParentWrapper>
        <SW.LeftSide>
          <PlanningSide yearWeek={yearWeek} setYearWeek={setYearWeek} />
          <Spacing height={24} />
          <SideHeader
            largeNumber={20}
            smallNumber={`/ ${25}`}
            subtitle="Tasks Completed"
          />
          <Spacing height={9} />
          <ProgressBar progress={50} />
        </SW.LeftSide>
        <Spacing width={48} height="100%" />
        <SW.RightSide>
          <PlanningOverview
            key={`${ownedBy}-${yearWeek}`}
            ownedBy={ownedBy}
            yearWeek={yearWeek}
          />
        </SW.RightSide>
      </SW.ParentWrapper>
    </CardContent>
  );
}
