import { styleSheet } from 'react-swiss';

export default styleSheet('PostFeed', {
  Container: {
    _size: ['100%', 'auto'],
    paddingBottom: '30px',
    empty: {
      _size: '100%',
    },
  },
  PostItem: {
    _size: ['100%', 'auto'],
    overflow: 'hidden',
    paddingTop: '9px',
    marginTop: '9px',
    '&:not(:first-child)': {
      // borderTop: '1px solid $deepBlue10',
      paddingTop: '24px',
      marginTop: '50px',
    },
  },
  Footer: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'between', 'center'],
    background: 'white',
    padding: '9px 12px',
    borderTop: '1px solid $sw3',
  },
  SubtitleWrapper: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', 'auto'],
  },
  SubtitleIcon: {
    _size: '18px',
    _svgColor: '$sw2',
    flex: 'none',
    marginRight: '3px',
    marginTop: '6px',
  },
  EmptyState: {
    _size: '100%',
    _flex: ['column', 'center', 'top'],
    paddingTop: '3%',
  },
  EmptyIllustration: {
    _size: ['100%', '60%'],
    _flex: ['column', 'center', 'center'],
    marginBottom: '12px',
    opacity: 0.8,
  },
  EmptySvg: {
    _size: ['auto', '100%'],
    maxWidth: '360px',
  },
  EmptyTitle: {
    _font: ['11px', '18px', 'bold'],
    color: '$sw1',
    textTransform: 'uppercase',
    pointerEvents: 'all',
  },
  EmptyText: {
    _font: ['12px', '18px'],
    color: '$sw2',
    marginTop: '9px',
    marginBottom: '18px',
    textAlign: 'center',
    pointerEvents: 'all',
  }
});