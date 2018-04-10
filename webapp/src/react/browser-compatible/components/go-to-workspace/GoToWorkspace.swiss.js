export default {
  ToWorkspaceWrapper: {
    _size: ['100%', 'auto'],
  },
  ToWorkspace: {
    _size: ['100%', '115px'],
    marginTop: '15px',
    float: 'initial !important',
    display: 'block',
    backgroundColor: '$blue',
    _borderRadius: ['6px'],
    paddingTop: '15px',
    textAlign: 'center',
    transition: '.35s ease',

    // p {
    //   @include font(12px, $blue-100, 24px, 500);
    //   margin: 0;padding: 0;
    //   transition: .35s ease;
    //   -ms-transition: .35s ease;
    // }

    '&hover': {
      paddingTop: '9px',
      backgroundColor: '$blue',
      transition: '.35s ease',
    }

    // #{$b}__svg {
    //   @include svg-color($blue-100);
    //   transition: .35s ease;
    //   -ms-transition: .35s ease;
    // }
  },
  SVG: {
    _size: ['100px'],
    // @include svg-color($blue-60);
    margin: '0',
    padding: '10px',
    transition: '.35s ease',
  }
}