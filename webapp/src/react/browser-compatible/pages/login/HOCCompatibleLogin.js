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

import SwipesStyles from './styles';

let size = '60px';

const View = SwipesStyles('div', {
  default : {
    'width': '100px',
    'height': '100px',
    'background': 'red',
    'animation': 'example 5s linear 2s infinite alternate',
    '@keyframes example': {
      'from': {
        'transform': 'rotate(0deg)'
      },
      'to': {
        'transform': 'rotate(360deg)'
      }
    },
    '& + &': {
      'background': 'green',
    },
    ':hover': {

    },
    '& ~ #{siblingRef}': {
      'background': 'purple',
    },
    '& > #{siblingRef}': {
      'background': 'yellow',
    },
    '& #{siblingRef}': {
      'background': 'pink',
    },
    '&:not(& + #{siblingRef})': {
      'color': 'darkblue',
    },
    '&::placeholder': {
      'color': 'green',
    }
    '&:after': {
      'content': '&'
    }
    '@media (max-width: 600px)': {
      'width': '600px',

      '& #{childRef}' : {
        'width': '10px',
      }
    },
  },
  small: {
    'width': '50px',
    'height': '50px',
    'background': 'green',

    '& ~ #{siblingRef}': {
      'background': 'gray',
    },
  }
});

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

class HOCCompatibleLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }
  render() {

    return (
      <View small>hi</View>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleLogin.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCCompatibleLogin);
