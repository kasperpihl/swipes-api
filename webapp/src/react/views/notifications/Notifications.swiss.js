import { styleSheet } from 'swiss-react';

export default styleSheet('Notifications', {
  Wrapper: {
    _size: ['360px', '540px'],
    backgroundColor: 'white',
    border: '1px solid $sw2',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 3px 6px 0 rgba(0,12,47, 0.3)'
  },

  Header: {
    _size: ['100%', '49px'],
    _flex: ['row', 'between', 'center'],
    borderBottom: '1px solid $sw3',
    padding: '0 15px',
  },

  Title: {
    _font: ['15px', '24px'],
    color: 'black',
  },

  EmptyState: {
    _size: ['100%'],
    _flex: ['column', 'center', 'top'],
    paddingTop: '30px',
  },

  EmptyIllustration: {
    marginBottom: '12px',
    opacity: '0.8',
  },

  EmptySVG: {
    _size: ['300px'],
  },

  EmptyTitle: {
    _font: ['11px', '18px', 'bold'],
    color: 'black',
    textTransform: 'uppercase',
    pointerEvents: 'all',
  },

  EmptyText: {
    _font: ['12px', '18px'],
    color: '$sw2',
    marginTop: '9px',
    textAlign: 'center',
    pointerEvents: 'all',
  },

})
