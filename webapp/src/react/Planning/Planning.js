import React, { useMemo, useState, useReducer } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import timeGetDefaultWeekYear from 'core/utils/time/timeGetDefaultWeekYear';
import useTeamTabs from './useTeamTabs';
import CardHeader from '_shared/Card/Header/CardHeader';
import CardContent from '_shared/Card/Content/CardContent';
import Spacing from '_shared/Spacing/Spacing';
import PlanningSide from './Side/PlanningSide';
import PlanningOverview from './Overview/PlanningOverview';
import Dropdown from '_shared/dropdown/Dropdown';

import PlanningContext from './PlanningContext';
import SW from './Planning.swiss';

export default connect(state => ({
  teams: state.teams
}))(Planning);

function Planning({ teams, initialYearWeek }) {
  const [yearWeek, setYearWeek] = useState(
    initialYearWeek || timeGetDefaultWeekYear()
  );

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
  const updateTeam = i => {
    updatePlanningState('reset');
    setTabIndex(i);
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
            <CardHeader
              title="Planning"
              dropdown={<Dropdown items={tabs} onChange={updateTeam} />}
            />
          </SW.HeaderWrapper>
        }
        noframe
      >
        <SW.ParentWrapper>
          <SW.LeftSide>
            <PlanningSide
              yearWeek={yearWeek}
              setYearWeek={updateYearWeek}
              ownedBy={ownedBy}
            />
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
