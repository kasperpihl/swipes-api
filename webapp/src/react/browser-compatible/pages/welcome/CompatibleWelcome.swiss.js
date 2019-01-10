import { styleSheet } from 'swiss-react';
import Icon from 'Icon';

export default styleSheet('CompatibleWelcome', {
  Wrapper: {
    padding: '30px 0',
    paddingBottom: '60px',
    overflow: 'hidden',
  },
  Table: {
    _borderRadius: '6px',
    width: '100%',
    border: '1px solid $sw3',
    overflow: 'hidden',
    marginTop: '30px',
  },
  TableHeader: {
    _size: ['100%', '60px'],
    borderBottom: '1px solid $sw3',
    display: 'table',
    paddingLeft: '15px',
  },
  TableCol: {
    _font: ['15px'],
    color: '$sw1',
    display: 'table-cell',
    width: '100%',
    float: 'left',
    lineHeight: '60px',
  },
  TableRow: {
    _size: ['100%', '60px'],
    paddingLeft: '15px',
    display: 'table',
    transition: '.15s ease',
    '&:not(:last-child)': {
      borderBottom: '1px solid $sw3',
    },
    '&:hover': {
      backgroundColor: '$sw3',
      transition: '.15s ease',
    },
  },
  RowItemName: {
    _font: ['13px', '60px'],
    color: '$sw2',
    dipslay: 'table-cell',
    height: '60px',
    verticalAlign: 'middle',
  },
  RowItemButton: {
    _font: ['11px', null, 500],
    display: 'table-cell',
    height: '60px',
    verticalAlign: 'middle',
    color: '$sw2',
    width: '60px',
    paddingRight: '15px',
    textAlign: 'right',
    textTransform: 'uppercase',
    transition: '.15s ease',
    '.row-hover:hover &': {
      color: '$blue',
      transition: '.15s ease',
    },
  },
  Hint: {
    _font: ['15px', '24px', '400'],
    color: '$sw2',
    marginTop: '12px',
  },
  ClearFix: {
    clear: 'both',
  },

  // Input
  CreateOrganization: {
    _size: ['100%', 'auto'],
    marginTop: '30px',
  },
  InputWrapper: {
    _flex: 'row',
    _size: ['100%', '45px'],
  },
  Input: {
    _el: 'input',
    _size: ['60%', '45px'],
    _font: ['15px', '25px'],
    rightInput: {
      _size: ['40%', '45px'],
    },
    leftRadius: {
      _borderRadius: ['6px', '0', '0', '6px'],
    },
    color: '$sw2',
    border: '1px solid $sw3',
    padding: '0 15px',
    transition: '.2s ease',
    '&:focus': {
      border: '1px solid $blue',
      transition: '.2s ease',
      color: '$sw1',
    },
  },
  Button: {
    _size: ['70px', '45px'],
    _borderRadius: ['0', '6px', '6px', '0'],
    border: '1px solid $sw3',
    transition: '.2s ease',
    backgroundColor: '$sw3',
    borderLeft: 'none',
    loading: {
      backgroundColor: '$blue',
      border: '1px solid $blue',
      borderLeft: 'none',
      transition: '.2s ease',
    },
    '&:hover': {
      backgroundColor: '$blue',
      border: '1px solid $blue',
      borderLeft: 'none',
      transition: '.2s ease',
    },
  },
  SVG: {
    _el: Icon,
    _size: '24px',
    _svgColor: '$sw1',
    position: 'absolute',
    left: '18px',
    top: '10px',
    transition: '.2s ease',
    '.button-hover:hover &': {
      _svgColor: 'white',
      transition: '.2s ease',
    },
  },
  Loader: {
    _el: Icon,
    _size: '12px',
    position: 'absolute',
    left: '23px',
    top: '15px',
  },
});
