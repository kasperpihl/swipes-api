export default {
  Wrapper: {
    _size: ['100%', 'auto'],
  },
  Title: {
    _font: ['11px', '18px', 'bold'],
    color: '$deepBlue80',
    textTransform: 'uppercase',
    paddingTop: '60px',
  },
  Text: {
    _widthSpecifications: ['initial', '230px'],
    _font: ['12px', '18px', '400'],
    color: '$deepBlue50',
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
  Section: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'left', 'top'],
  },
  SectionTitle: {
    _size: ['100%', '66px'],
    paddingTop: '24px',
    flex: 'none',
    _font: ['12px', '18px', 500],
    color: '$dark',
    borderBottom: '1px solid $light',
    marginBottom: '24px',
  },
  Footer: {
    _size: ['100%', '54px'],
    borderTop: '1px solid $light',
    _flex: ['row', 'right', 'center'],
  },
}