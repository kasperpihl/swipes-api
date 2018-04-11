export default {
  CompatibleAssigneesWrapper: {
    _size: ['auto', '48px'],
    marginLeft: '15px',
    display: 'table-cell',
    '@media $max600': {
      _size: ['initial', '48px'],
      display: 'inline-block',
      float: 'initial',
      left: '50%',
      margin: '17px 15px 29px 0',
      transform: 'translateX(-50%)',
    },
  },
  Assignee: {
    _size: ['32px'],
    border: '1px solid $sw5',
    backgroundColor: '$sw5',
    borderRadius: '50%',
    marginTop: '-16px',
    top: '50%',
    float: '#{float}',
  },
  ProfilePic: {
    _size: ['30px'],
    borderRadius: '50%',
  },
  Initials: {
    _size: ['30px'],
    _font: ['12px', '30px', 500],
    color: '$sw5',
    backgroundColor: '$blue',
    borderRadius: '50%',
    textAlign: 'center',
    display: 'table-cell',
    verticalAlign: 'middle',
    transform: 'translate(1px, 1px)',
  },
}