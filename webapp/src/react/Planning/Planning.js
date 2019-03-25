import React, { useMemo, useState, useReducer } from 'react';
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
import PlanningContext from './PlanningContext';

export default connect(state => ({
  teams: state.teams
}))(Planning);

function Planning({ teams }) {
  const defaultYearWeek = useMemo(() => {
    const now = moment();
    let year = now.year();
    // Ensure working when week 1 starts in december.
    if (now.month() === 12 && now.week() < 4) {
      year = year + 1;
    }
    return `${year}-${now.week()}`;
  }, []);
  const [yearWeek, setYearWeek] = useState(defaultYearWeek);

  const [tabs, tabIndex, setTabIndex] = useTeamTabs(teams);

  const [planningState, updatePlanningState] = useReducer(
    (state, action) => {
      if (action === 'reset') {
        return {
          editingId: null
        };
      }
      return {
        ...state,
        ...action
      };
    },
    {
      editingId: null
    }
  );

  const ownedBy = tabs[tabIndex].id;

  const updateYearWeek = yW => {
    updatePlanningState('reset');
    setYearWeek(yW);
  };

  const handleNextWeek = () => {
    const now = moment();
    let year = now.year();
    let week = now.week();
    now.add(1, 'week');
    if (now.week() < week) {
      year = year + 1;
    }

    updateYearWeek(`${year}-${now.week()}`);
  };

  const planningValue = useMemo(() => [planningState, updatePlanningState], [
    planningState,
    updatePlanningState
  ]);

  return (
    <PlanningContext.Provider value={planningValue}>
      <CardContent
        header={
          <SW.HeaderWrapper>
            <CardHeader title="Planning">
              <Button
                title="Plan next week"
                icon="Calendar"
                onClick={handleNextWeek}
              />
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
        <SW.ParentWrapper>
          <PlanningSide yearWeek={yearWeek} setYearWeek={updateYearWeek} />
          <Spacing width={48} />
          <SW.RightSide>
            <PlanningOverview
              key={`${ownedBy}-${yearWeek}`}
              ownedBy={ownedBy}
              yearWeek={yearWeek}
            />
          </SW.RightSide>
        </SW.ParentWrapper>
      </CardContent>
    </PlanningContext.Provider>
  );
}
