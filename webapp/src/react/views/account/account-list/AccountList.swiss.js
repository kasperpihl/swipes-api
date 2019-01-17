import { styleSheet } from 'swiss-react';
import Icon from 'src/react/icons/Icon';
import Button from 'src/react/components/Button/Button';

export default styleSheet('AccountList', {
  Wrapper: {
    _size: ['100%', 'auto'],
    _flex: ['row'],
    flexWrap: 'wrap',
    padding: '15px'
  },

  Header: {
    padding: '0 30px'
  },

  AccountButton: {
    _el: Button,
    right: '30px',
    bottom: '30px',
    position: 'fixed'
  },

  AccountItem: {
    _size: ['33%', 'initial'],
    _widthSpecifications: ['200px', 'initial'],
    _heigthSpecifications: ['150px', 'initial'],
    flexBasis: '33%',
    flexShrink: '0',
    flexGrow: '0',
    padding: '15px',
    transition: '.25s ease',

    '&:before': {
      _size: ['100%'],
      content: '',
      position: 'absolute',
      left: '0',
      top: '0',
      backgroundColor: '$blue5',
      zIndex: '-1',
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
    },

    '&:after': {
      _size: ['100%'],
      content: '',
      position: 'absolute',
      left: '0',
      top: '0',
      zIndex: '-1',
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
      transition: '.25s ease-out'
    },

    '&:hover': {
      boxShadow: '0 6px 12px 1px rgba(0,12,47, 0.15)',
      transition: '.25s ease-in',

      '&:before': {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        transition: '.25s ease-in'
      },

      '&:after': {
        transition: '.25s ease-out'
      }
    }
  },

  CardTitle: {
    _size: ['100%', '38px'],
    _font: ['15px', '20px', '500'],
    _flex: ['row', 'between', 'center'],
    borderBottom: '1px solid'
  },

  Description: {
    _size: ['100%', 'auto'],
    _font: ['12px', '15px'],
    color: '$sw2',
    marginTop: '12px'
  },

  StyledSVG: {
    _el: Icon,
    _size: ['24px'],
    opacity: '0',
    transition: '.3s ease',
    transform: 'translateX(-15px)',

    '.accountItem:hover &': {
      opacity: '1',
      transform: 'translateX(0px)'
    }
  }
});
