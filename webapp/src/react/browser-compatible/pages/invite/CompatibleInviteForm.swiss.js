import {styleSheet} from 'swiss-react';

export default styleSheet('InviteForm', {
  InviteForm: {
    _size: ['100%', 'auto'],
    marginTop: '45px',
  },

  Wrapper: {
    _size: ['100%', 'auto'],
    marginTop: '30px',
  },

  AddButton: {
    _font: ['12px', '24px'],
    height: '30px',
    display: 'inline-block',
    float: 'left',
    textAlign: 'right',
    padding: '3px 0',
    marginTop: '15px',
    color: '$sw2',
    '&:hover': {
      color: '$blue',
    },

    '@media $max600': {
      width: '100%',
      margin:'15px auto',
      textAlign: 'center',
    }
  },

  AddSVG: {
    _size: ['24px'],
    _svgColor: '$sw2',
    float: 'right',

    '@media $max600':{
      float: 'initial',
      transform: 'translateY(7px)',
    }
  },

  InputRow: {
    _size: ['100%', '48px'],
    border: '1px solid $sw3',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '15px',


    '@media $max600': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '96px',
    },
  },

  RowWrapper: {
    display: 'table-cell',

    '&:first-child': {
      width: '40%',
    },

    '&:last-child': {
      width: '60%',
    }
  },

  Separator: {
    _size: ['1px', '40px'],
    backgroundColor: '$sw3',
    position: 'absolute',
    margin: '3px 0',
    left: '40%',

    '@media $max600': {
      width: '100%',
      height: '1px',
      margin: '0',
      padding: '0',
      left: '0',
      top: '48px',

    },

  },

  States: {
    _size: ['24px'],
    position: 'absolute',
    right: '-39px',
    top: '11px',

    '@media $max600': {
      backgroundColor: '$blue',
      right: '0',
      top: '36px',
    }
  },

  Loader: {
    _size: ['12px'],
    position: 'absolute',
    left: '6px',
    top: '6px',
  },

  Success: {
    _size: ['18px'],
    _svgColor: '$green',
    position: 'absolute',
    left: '3px',
    top: '3px',
  }
})
