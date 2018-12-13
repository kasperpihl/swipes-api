import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';

export default styleSheet('EmptyState', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['column', 'center', 'center'],
    pointerEvents: 'none',
    fill: {
      height: '100%'
    },

    'page=takeAction': {
      transform: 'translateY(-38px)',
      transition: '.15s ease'
    },

    'page=searchResult': {
      transform: 'translateY(140px)'
    },

    'page=Discussions': {
      transform: 'translateY(100%)'
    }
  },

  ImageWrapper: {
    paddingBottom: '30px',

    searchResult: {
      _size: ['100%', 'auto'],
      _flex: ['column', 'center', 'center'],
      marginBotton: '12px'
    }
  },

  Image: {
    _el: Icon,
    _size: ['150px', 'auto'],

    large: {
      _size: ['300px', 'auto']
    },

    'page=takeAction': {
      _size: ['54px', '114px'],
      transform: 'translateX(calc(-50% + 6px))'
    },

    searchResult: {
      _size: ['auto', '100%'],
      maxWidth: '360px',
      opacity: '0.8'
    }
  },

  Title: {
    _font: ['13px', '18px', 'bold'],
    color: '$sw2',
    userSelect: 'none',

    large: {
      _font: ['18px', '24px']
    },

    'page=takeAction': {
      color: '$sw1'
    },

    searchResult: {
      _font: ['11px', '18px', 'bold'],
      textTransform: 'uppercase',
      pointerEvents: 'all'
    }
  },

  Description: {
    _font: ['12px', '18px'],
    color: '$sw2',
    marginTop: '9px',
    textAlign: 'center',
    userSelect: 'none',

    large: {
      _font: ['14px', '20px']
    }
  }
});
