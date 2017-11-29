import { element } from 'react-swiss';

export default element({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'initial',
  'wrap': {
    flexWrap: 'wrap',
  },
  'center': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'horizontal=left': {
    justifyContent: 'flex-start',
  },
  'horizontal=center': {
    justifyContent: 'center',
  },
  'horizontal=right': {
    justifyContent: 'flex-end',
  },
  'horizontal=between': {
    justifyContent: 'space-between',
  },
  'horizontal=around': {
    justifyContent: 'space-around',
  },
  'vertical=top': {
    alignItems: 'flex-start',
  },
  'vertical=center': {
    alignItems: 'center',
  },
  'vertical=bottom': {
    alignItems: 'flex-end',
  },
  'vertical=stretch': {
    alignItems: 'stretch',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'initial',
    'center': {
      justifyContent: 'center',
      alignItems: 'center',
    },
    'horizontal=left': {
      alignItems: 'flex-start',
    },
    'horizontal=center': {
      alignItems: 'center',
    },
    'horizontal=right': {
      alignItems: 'flex-end',
    },
    'vertical=top': {
      justifyContent: 'flex-start',
    },
    'vertical=center': {
      justifyContent: 'center',
    },
    'vertical=bottom': {
      justifyContent: 'flex-end',
    },
    'vertical=between': {
      justifyContent: 'space-between',
    },
    'vertical=around': {
      justifyContent: 'space-around',
    },
  },
  gutter: {
    '&:not(:last-child):after': {
      _size: [`#{gutterSize=30}px`, '100%'],
      backgroundColor: 'purple',
      content: '',

      column: {
        _size: ['100%', `#{gutterSize=30}px`],
      }
    }
  }
});
