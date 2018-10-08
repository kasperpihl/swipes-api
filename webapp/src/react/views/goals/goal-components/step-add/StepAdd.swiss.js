import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('StepAdd', {
  Wrapper: {
    _flex: ['row', 'left', 'center'],
    size: ['100%', 'auto'],
    borderTop: '1px solid $sw3',
  },
  LeftIcon: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw1',
    margin: '12px',

    flex: 'none',
  },
  AssigneesWrapper: {
    flex: 'none',
    opacity: 0,
    paddingRight: '6px',
    shown: {
      opacity: 1,
    },
  },
  SubmitWrapper: {
    _size: '36px',
    flex: 'none',
    hidden: {
      display: 'none',
    },
  },
  InputWrapper: {
    _flex: ['column'],
    width: '100%',
    '& .public-DraftEditor-content, & .public-DraftEditorPlaceholder-root': {
      padding: '12px',
    },
  },
  ReuploadWrapper: {
    padding: '0 6px',
    flex: 'none',
    _flex: ['column', 'center', 'top'],
  },
  ErrorLabel: {
    color: '$red',
    _font: ['12px', '18px', 400],
  },
  LoaderCircle: {
    flex: 'none',
    margin: '6px',
    _size: '36px',
    backgroundColor: '$sw1',
    borderRadius: '100%',
    animation: 'button-loader 1.0s infinite ease-in-out',
  },
});
