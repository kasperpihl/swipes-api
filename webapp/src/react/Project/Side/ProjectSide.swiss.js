import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';

export default styleSheet('ProjectSide', {
  Wrapper: {
    _size: ['180px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    flex: 'none'
  },

  StepSlider: {
    _el: StepSlider,
    width: '100%'
  },

  ButtonWrapper: {
    _flex: ['column', 'left', 'top'],
    width: '100%',
    padding: '36px 0 12px 0',
    borderBottom: '1px solid $sw4'
  },

  Button: {
    _el: Button,

    '&:first-child': {
      marginBottom: '6px'
    }
  }
});
