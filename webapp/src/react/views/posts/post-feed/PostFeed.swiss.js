export default {
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
      borderTop: '1px solid $deepBlue10',
      paddingTop: '24px',
      marginTop: '23px',
    },
  },
  Footer: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'between', 'center'],
    background: 'white',
    padding: '9px 12px',
    borderTop: '1px solid #F2F4F6',
  },
  SubtitleWrapper: {
    _flex: ['row', 'left', 'center'],
    _size: ['100%', 'auto'],
  },
  SubtitleIcon: {
    _size: '18px',
    _svgColor: '$deepBlue40',
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
    color: '$deepBlue100',
    textTransform: 'uppercase',
    pointerEvents: 'all',
  },
  EmptyText: {
    _font: ['12px', '18px'],
    color: '$deepBlue40',
    marginTop: '9px',
    marginBottom: '18px',
    textAlign: 'center',
    pointerEvents: 'all',
  }
}