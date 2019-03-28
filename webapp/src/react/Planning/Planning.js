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

  const planningValue = useMemo(() => [planningState, updatePlanningState], [
    planningState,
    updatePlanningState
  ]);

  return (
    <PlanningContext.Provider value={planningValue}>
      <CardContent
        header={
          <SW.HeaderWrapper>
            <CardHeader title="Planning" />
          </SW.HeaderWrapper>
        }
        noframe
      >
        <SW.ParentWrapper>
          <SW.LeftSide>
            <PlanningSide yearWeek={yearWeek} setYearWeek={updateYearWeek} />
          </SW.LeftSide>
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
