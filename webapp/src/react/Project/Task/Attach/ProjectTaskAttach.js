import React, { useContext, useState } from 'react';

import { ProjectContext } from 'src/react/contexts';
import useProjectSlice from 'core/react/_hooks/useProjectSlice';

import AttachButton from '_shared/AttachButton/AttachButton';
import SW from './ProjectTaskAttach.swiss';

export default function ProjectTask({ taskId }) {
  const stateManager = useContext(ProjectContext);

  const [ownedBy] = useProjectSlice(stateManager, (clientState, localState) => [
    clientState.get('owned_by')
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAttach = att => {
    console.log(att);
    stateManager.editHandler.attach(taskId, att);
  };

  return (
    <SW.Wrapper hide={!isLoading}>
      <AttachButton
        ownedBy={ownedBy}
        buttonProps={{ small: true }}
        onStatusChange={setIsLoading}
        onAttach={handleAttach}
      />
    </SW.Wrapper>
  );
}
