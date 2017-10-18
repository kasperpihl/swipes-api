/*
[] support media queries
[] support key modification hook
[] support value modification hook
[] support variables in values
Website
Webapp
Mobile
Backend
Integrations
QA
*/



import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

import swiss from 'react-swiss';

swiss.addMixin('size', (width=null, height=null) => ({
  width: width || 'auto',
  height: height || width || 'auto',
}));

const Container = swiss('div', {
  _size: '100px',
  backgroundColor: 'blue',
  animation: 'example2 .5s ease-in infinite alternate',
  '@keyframes example': {
    '0%': {
      transform: 'rotate(0deg)  scale(1)'
    },
    '50%': {
      transform: 'rotate(180deg) scale(.5)'
    },
    '100%': {
      transform: 'rotate(360deg)  scale(1)'
    }
  },
  '@media (max-width: 600px)': {
    background: 'red',
  },
  '@media (max-width: 600px)': {
    '& > *': {
      background: 'red',
    },
  },
});

const InnerView = swiss('div', {
  default : {
    width: '50px',
    height: '50px',
    background: 'green',
  }
});

//  default : {
//     'width': '100px',
//     'height': '100px',
//     'background': 'red',
//     'animation': 'example 5s linear 2s infinite alternate',
//     '@keyframes example': {
//       'from': {
//         'transform': 'rotate(0deg)'
//       },
//       'to': {
//         'transform': 'rotate(360deg)'
//       }
//     },
//     '& + &': {
//       'background': 'green',
//     },
//     ':hover': {

//     },
//     '& ~ #{siblingRef}': {
//       'background': 'purple',
//     },
//     '& > #{siblingRef}': {
//       'background': 'yellow',
//     },
//     '& #{siblingRef}': {
//       'background': 'pink',
//     },
//     '&:not(& + #{siblingRef})': {
//       'color': 'darkblue',
//     },
//     '&::placeholder': {
//       'color': 'green',
//     }
//   },
//   small: {
//     'width': '50px',
//     'height': '50px',
//     'background': 'green',

//     '& ~ #{siblingRef}': {
//       'background': 'gray',
//     },
//   }
// });

// <style>
//   .view {
//     width: 100px;
//     height: 100px;
//     background: red;
//     animation: example 5s linear 2s infinite alternate;
//   }

//   .view + .view {
//     background: green;
//   }

//   .view ~ .siblingRef {
//     background: purple;
//   }

//   .view > .siblingRef {
//     background: yellow;
//   }

//   .view .siblingRef {
//     background: pink;
//   }

//   .view:not(.view + .siblingRef) {
//     color: darkblue;
//   }

//   .view::placeholder {
//     color: green;
//   }

//   @keyframes example {
//    from {
//       transform: rotate(0deg)
//     }
//     to {
//       transform: rotate(360deg)
//     }
//   }

//   @media (max-width: 600px) {
//     .view {
//       width: 600px;
//     }
//   }

//   .view.small {
//     width: 50px;
//     height: 50px;
//     background: green;
//   }

//   .view.small ~ .siblingRef {
//     background: gray;
//   }
// </style>

class SwissTester extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <Container>
        <InnerView>Hi</InnerView>
      </Container>
    );
  }
}
// const { string } = PropTypes;

SwissTester.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(SwissTester);
