import 'react-dates/initialize';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useContext } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import contextMenu from 'src/utils/contextMenu';

import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import Button from '_shared/Button/Button';
import SW from './ProjectTaskDue.swiss';

export default function ProjectTaskDue({ taskId }) {
  const stateManager = useContext(ProjectContext);

  const [dueDate] = useProjectSlice(stateManager, clientState => [
    clientState.getIn(['tasks_by_id', taskId, 'due_date'])
  ]);

  const handleDue = e => {
    contextMenu(
      ({ initialDate, onSelect, hide }) => {
        const handleSelect = d => {
          onSelect(d instanceof Date ? d : null);
          hide();
        };
        return (
          <SW.ModalWrapper>
            <DatePicker inline selected={initialDate} onChange={handleSelect} />
            <Button title="Remove due date" onClick={handleSelect} />
          </SW.ModalWrapper>
        );
      },

      e,
      {
        onSelect: d =>
          stateManager.editHandler.updateDueDate(
            taskId,
            d ? moment(d).format('YYYY-MM-DD') : null
          ),
        initialDate: dueDate ? moment(dueDate).toDate() : null
      }
    );
  };

  return (
    <SW.Wrapper hide={!dueDate}>
      <Button small onClick={handleDue} icon="Calendar" />
    </SW.Wrapper>
  );
}
