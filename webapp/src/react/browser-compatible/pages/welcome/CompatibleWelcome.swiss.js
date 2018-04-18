import { styleSheet } from 'react-swiss';

export default styleSheet({
  CompatibleWelcomeWrapper: {
    padding: '30px 0',
    paddingBottom: '60px',
    overflow: 'hidden',
  },
  Table: {
    _borderRadius: '6px',
    width: '100%',
    border: '1px solid $sw4',
    overflow: 'hidden',
    marginTop: '30px',
  },
  TableHeader: {
    _size: ['100%', '60px'],
    borderBottom: '1px solid $sw4',
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
      borderBottom: '1px solid $sw4',
    },
    '&:hover': {
      backgroundColor: '$sw4',
      transition: '.15s ease'
    }
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
    fontStyle: 'italic',
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
    _size: ['100%', '45px'],
  },
  Input: {
    _size: ['100%', '45px'],
    _font: ['15px', '60px'],
    _borderRadius: '6px',
    color: '$sw2',
    border: '1px solid $sw4',
    padding: '0 15px',
    transition: '.2s ease',
    '&::-webkit-input-placeholder': {
      _font: ['11px', '15px'],
      color: '$sw3',
    },
    // :placeholder-shown is not supported almost anywhere. Why we are using it in a browser compatible page?
    // &:not(:placeholder-shown) + .create-org__label {
    //   @include font(11px, $deepBlue-50, 15px) 
    //   top: 0;
    //   transition: .2s ease;
    // }
    '&:focus': {
      border: '1px solid $blue',
      transition: '.2s ease',
    }
  },
  Label: {
    _font: ['15px', '25px'],
    color: '$sw3',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '9px',
    position: 'absolute',
    backgroundColor: '$sw5',
    padding: '0 6px',
    transition: '.2s ease',
    'float': {
      _font: ['11px', '15px'],
      color: '$sw3',
      top: '0',
      transition: '.2s ease',
    }
  },
  Button: {
    _size: ['60px', '44px'],
    _borderRadius: ['0', '6px', '6px', '0'],
    position: 'absolute',
    top: '0',
    right: '0',
    borderLeft: '1px solid $sw4',
    transition: '.2s ease',
    '&:hover': {
      backgroundColor: '$sw4',
      transition: '.2s ease',
    },
    'loading': {
      backgroundColor: '$blue',
      borderLeft: '1px solid $blue',
      transition: '.2s ease',
    },
    'focused': {
      backgroundColor: '$blue',
      borderLeft: '1px solid $blue',
      transition: '.2s ease',
    }
  },
  SVG: {
    _size: '24px',
    _svgColor: '$sw3',
    position: 'absolute',
    left: '18px',
    top: '10px',
    transition: '.2s ease',
    '!focused && .button-hover:hover': {
      _svgColor: '$sw1',
      transition: '.2s ease',
    },
    'focused && .button-hover:hover': {
      _svgColor: '$blue80',
      transition: '.2s ease',
    },
    'focused': {
      _svgColor: 'white',
      transition: '.2s ease',
    },
  },
  Loader: {
    _size: '12px',
    position: 'absolute',
    left: '12px',
    top: '10px',
  }
});