export default {
  Wrapper: {
    _size: ['100%', 'auto'],
  },
  Title: {
    _font: ['11px', '$deepBlue80', '18px', 'bold'],
    textTransform: 'uppercase',
    paddingTop: '60px',
  },
  Text: {
    _widthSpecifications: ['initial', '230px'],
    _font: ['12px', '$deepBlue50', '18px', '400'],
    paddingTop: '6px',
    textAlign: 'center',
  },
  EmptyStateWrapper: {
    _flex: ['column', 'center', 'center'],
    _size: ['100%', 'auto'],
    transition: '.15s ease',
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
      transition: '.15s ease',
    },
  },
  DroppableWrapper: {
    _flex: 'row',
    _size: ['100%', 'auto'],
  },
  Spacer: {
    _flex: 'row',
    width: '30px',
    flex: 'none',
  },
  TabWrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row', 'between'],
  },
}