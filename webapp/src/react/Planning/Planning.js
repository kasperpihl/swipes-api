import React, { useMemo, useState, useReducer } from 'react';
import { connect } from 'react-redux';
import timeGetDefaultWeekYear from 'core/utils/time/timeGetDefaultWeekYear';
import CardHeader from '_shared/Card/Header/CardHeader';
import CardContent from '_shared/Card/Content/CardContent';
import Spacing from '_shared/Spacing/Spacing';
import PlanningSide from './Side/PlanningSide';
import PlanningOverview from './Overview/PlanningOverview';

import PlanningContext from './PlanningContext';
import SW from './Planning.swiss';

export default connect(state => ({
  selectedTeamId: state.main.get('selectedTeamId')
}))(Planning);

function Planning({ initialYearWeek, selectedTeamId }) {
  const [yearWeek, setYearWeek] = useState(
    initialYearWeek || timeGetDefaultWeekYear()
  );

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
            <CardHeader title="Planning" teamPicker />
          </SW.HeaderWrapper>
        }
        noframe
      >
        <SW.ParentWrapper>
          <SW.LeftSide>
            <PlanningSide
              yearWeek={yearWeek}
              setYearWeek={updateYearWeek}
              ownedBy={selectedTeamId}
            />
          </SW.LeftSide>
          <Spacing width={48} />

          <SW.RightSide>
            <PlanningOverview
              key={`${selectedTeamId}-${yearWeek}`}
              ownedBy={selectedTeamId}
              yearWeek={yearWeek}
            />
          </SW.RightSide>
        </SW.ParentWrapper>
      </CardContent>
    </PlanningContext.Provider>
  );
}
