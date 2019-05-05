import { styleSheet } from 'swiss-react';

export default styleSheet('ProjectTaskAttach', {
  Wrapper: {
    _flex: ['row', 'center', 'center'],
    height: '26px',
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
