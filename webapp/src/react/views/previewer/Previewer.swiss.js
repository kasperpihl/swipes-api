import { styleSheet } from 'react-swiss';

export default styleSheet('Previewer', {
  Footer: {
    _size: ['100%', '60px'],
    _flex: ['row', 'right', 'center'],
    backgroundColor: '$sw5',
    borderTop: '1px solid $sw4',
    padding: '0 30px',
  },
  FooterButton: {
    marginLeft: '15px',
  },
  LoaderWrapper: {
    _size: '100%',
  },
  NoPreviewWrapper: {
    _size: '100%',
    _flex: 'column',
  },
  NoPreviewHeader: {
    _font: ['27px', '36px'],
    color: '$sw1',
  },
  NoPreviewText: {
    _size: ['100%', 'auto'],
    _font: ['15px', '24px'],
    color: '$sw1',
    minWidth: '300px',
    maxWidth: '425px',
    paddingTop: '15px',
    textAlign: 'center'
  },
  FileWrapper: {
    _size: '100%',
    hidden: {
      opacity: 0,
    }
  },
  ContentWrapper: {
    _size: ['100%', 'auto'],
    display: 'flex',
  },

});

// .preview-content {
//   $b: &;

//   &__column {

//     &--main {
//       @include size(calc(100% - 270px - 10%), auto);
//       margin-right: 10%;
//     }

//     &--side {
//       @include size(270px, auto);
//       @include flex(none);
//     }
//   }

//   &__section {

//     &:not(:first-child) {
//       margin-top: 60px;
//     }
//   }
// }

