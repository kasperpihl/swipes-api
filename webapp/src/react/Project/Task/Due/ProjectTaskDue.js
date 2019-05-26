import React, { useContext } from 'react';
import moment from 'moment';
import contextMenu from 'src/utils/contextMenu';
import Calendar from 'react-calendar';
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
            {initialDate && (
              <Button title="Clear due date" onClick={handleSelect} />
            )}
            <Calendar
              value={initialDate}
              onChange={handleSelect}
              prev2Label={null}
              next2Label={null}
            />
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

  const buttonProps = {
    small: true,
    onClick: handleDue,
    icon: 'Calendar'
  };
  if (dueDate) {
    delete buttonProps.icon;
    const dueMoment = moment(dueDate);
    buttonProps.title = dueMoment.format('MMM D');
    if (dueMoment.isSameOrBefore(moment(), 'days')) {
      buttonProps.dueSoon = true;
    }
  }

  return (
    <SW.Wrapper hide={!dueDate}>
      <Button {...buttonProps} />
    </SW.Wrapper>
  );
}
