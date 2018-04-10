export default {
  ATag: {
    _size: ['250px', '36px'],
    _font: ['12px', '36px', 500],
    color: '$sw5',
    backgroundColor: '$blue',
    display: 'inline-block',
    float: 'initial',
    cursor: 'pointer',
    zIndex: 2,
    left: '50%',
    textAlign: 'center',
    transform: 'translateX(-50%) !important',
    verticalAlign: 'middle',
    '&:hover, &:focus': {
      opacity: '0.8'
    }
  }
}