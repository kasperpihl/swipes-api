import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';
import StepSlider from 'src/react/_components/StepSlider/StepSlider';

export default styleSheet('ProjectOverview', {
  Wrapper: {
    _flex: ['row', 'flex-start', 'flex-start'],
    padding: '0 30px'
  },
  TasksWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    marginLeft: '48px'
  },
  AddButton: {
    _el: Button.Rounded,
    marginLeft: '22px'
  },
  Div: {
    _size: ['500px', 'auto'],
    _flex: ['column', 'center', 'between'],
    position: 'absolute',
    top: '10%',
    left: '20%',
    marginBottom: '50px'
  },

  SidebarWrapper: {
    _size: ['200px', 'auto'],
    _flex: ['column', 'flex-start', 'flex-start'],
    flex: 'none'
  },

  ProgressBarWrapper: {
    _size: ['100%', 'auto'],
    margin: '12px 0 24px 0'
  },

  ProgressBarOuter: {
    _size: ['100%', '16px'],
    _flex: ['column', 'flex-start', 'center'],
    borderRadius: '8px',
    padding: '2px',
    border: '2px solid $green'
  },

  ProgressBarInner: {
    width: get => `${get('width')}%`,
    height: '10px',
    backgroundColor: '$green',
    borderRadius: '5px'
  },

  SliderWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    padding: '12px 0',
    borderTop: '1px solid $sw3',
    borderBottom: '1px solid $sw3'
  },

  StepSlider: {
    _el: StepSlider,
    width: '100%'
  }
});
