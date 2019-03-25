import { useContext } from 'react';
import PlanningContext from './PlanningContext';

export default function usePlanningState() {
  return useContext(PlanningContext);
}
