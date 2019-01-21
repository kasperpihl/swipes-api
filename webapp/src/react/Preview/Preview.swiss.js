import { styleSheet } from 'swiss-react';
import Button from 'src/react/_components/Button/Button';

export default styleSheet('Preview', {
  Footer: {
    _size: ['100%', '60px'],
    _flex: ['row', 'right', 'center'],
    backgroundColor: '$sw5',
    borderTop: '1px solid $sw3',
    padding: '0 30px'
  },
  FooterButton: {
    _el: Button.Rounded,
    marginLeft: '15px'
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
