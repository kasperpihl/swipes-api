export default {
  CompatibleAssigneesWrapper: {
    _size: ['auto', '48px'],
    marginLeft: '15px',
    display: 'table-cell',
  },
  Assignee: {
    _size: ['32px'],
    border: '1px solid white',
    backgroundColor: 'white',
    borderRadius: '50%',
    marginTop: '-16px',
    top: '50%',
    float: {
      float: '#{float}',
    },
  },
  ProfilePic: {
    _size: ['30px'],
    borderRadius: '50%',
  },
  Initials: {
    _size: ['30px'],
    _font: ['12px', '30px', 500],
    color: 'white',
    backgroundColor: '$blue',
    borderRadius: '50%',
    textAlign: 'center',
    display: 'table-cell',
    verticalAlign: 'middle',
    transform: 'translate(1px, 1px)',
  },
}

// NOT IMPLEMENTED YET
// @media (max-width: 600px) {
//   .compatible-assignees {
//     @include size(initial, 48px);
//     display: inline-block;
//     float: initial;
//     left: 50%;
//     margin: 17px 15px 29px 0;
//     transform: translateX(-50%);
//     -ms-transform: translateX(-50%);
//   }
// }