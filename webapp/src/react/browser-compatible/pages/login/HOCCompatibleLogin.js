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

const WrapperView = SwipesStyles('div', {
  width: '100px',
  height: '100px',
  background: 'red',
  
  after: {

  },
  before: {

  }
});
const FlexContainer = SwipesStyles('div', {
  width: '100px',
  height: '100px',
  background: 'red',
});

const WrapperCell = SwipesStyles('div', {
  width: '100px',
  height: '100px',
  background: 'red',

  hover: {
    children: 'WrapperItem'
  }
});
const WrapperItem = SwipesStyles('span', {
  default: {
    background: 'green',
    '#{hoverRef}:first-child': {
      ':hover': {
      },
      background: 'blue',
    },
  },
  disabled: {
    background: 'black'
  }
})

class HOCCompatibleLogin extends PureComponent {
  render() {
    let className = 'asdasd'
    return (
      <div>
        <WrapperCell>
          <WrapperItem type="top">
            hello
          </WrapperItem>
          <WrapperItem hoverRef={WrapperCell.ref}>
            hello
          </WrapperItem>
          <WrapperItem type="bottom" hoverRef={WrapperItem.ref}>
            hello
          </WrapperItem>
        </WrapperCell>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCCompatibleLogin.propTypes = {};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
})(HOCCompatibleLogin);
