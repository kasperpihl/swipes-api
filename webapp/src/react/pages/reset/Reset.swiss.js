import { styleSheet } from 'swiss-react';

export default styleSheet('Reset', {
  Wrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '360px',
    transform: 'translateY(-50%) translateX(-50%)',
  },
  Loading: {
    textAlign: 'center',
  },
  Button: {
    marginTop: '10px',
    height: '36px',
  }
});


.reset {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 360px;
  transform: translateY(-50%) translateX(-50%);


  .loading {
    text-align: center;
  }

  .button {
    margin-top: 10px;
    @include size(auto, 36px);
    @include font(12px, white, 36px, 500);
    background-color: $blue-100;
    border-radius: 100px;
    padding: 0 12px;
    float: right;
    margin-top: 10px;
    cursor: pointer;
    z-index: 2;

    &:hover {
      background-color: $blue-80;
    }
  }
}
