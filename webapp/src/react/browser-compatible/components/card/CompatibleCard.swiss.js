export default {
  CardWrapper: {
    _size: ['100%'],
    overflowY: 'auto',
    paddingTop: '30px',
    // HOW I DO THAT?
    // -webkit-overflow-scrolling: touch;
  },
  Card: {
    _size: ['100%', 'auto'],
    _borderRadius: ['3px', '3px', '0px', '0px'],
    minWidth: 'initial',
    maxWidth: '600px',
    minHeight: '100%',
    maxHeight: 'initial',
    // BUG
    // When using sw5 here the ugly loader that we have there is on white background === mess
    backgroundColor: '$sw5',
    boxShadow: '0 6px 12px 1px rgba(0,12,47,0.3)',
    margin: '0 auto',
    padding: '0 60px',
  }
}


// NOT IMPLEMENTED YET

// @media (max-width: 600px) {
//   .card-wrapper {
//     padding-top: 0;
//     background-color: white;
//   }

//   .card-wrapper .card {
//     padding: 0 24px;
//   }
// }

// @media (max-height: 800px) {
//   .card-wrapper {
//     padding-top: 0;
//   }

//   .card-wrapper .card {
//     @include border-radius(0px, 0px, 0px, 0px);
//   }
// }