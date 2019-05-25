import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTaskDue', {
  ModalWrapper: {
    _flex: ['column', 'center', 'center'],
    background: '$base'
  },
  Wrapper: {
    _flex: ['row', 'center', 'center'],
    height: '26px',
    flex: 'none',
    userSelect: 'none',

    hide: {
      opacity: '0',
      visbility: 'hidden',
      '.ProjectTask_Wrapper:hover &': {
        opacity: '1',
        visbility: 'visible'
      }
    }
  }
});
