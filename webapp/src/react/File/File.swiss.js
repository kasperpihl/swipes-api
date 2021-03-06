import { styleSheet } from 'swiss-react';

export default styleSheet('File', {
  Footer: {
    _size: ['100%', '60px'],
    _flex: ['row', 'right', 'center'],
    backgroundColor: '$sw5',
    borderTop: '1px solid $sw3',
    padding: '0 30px'
  },
  LoaderWrapper: {
    _size: '100%'
  },
  NoPreviewWrapper: {
    _size: '100%',
    _flex: 'column'
  },
  NoPreviewHeader: {
    _font: ['27px', '36px'],
    color: '$sw1'
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
      opacity: 0
    }
  }
});
