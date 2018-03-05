import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import RotateLoader from 'components/loaders/RotateLoader';
// import './styles/goal-checkbox.scss';


import { element } from 'react-swiss';

const CheckboxWrapper = element('div', {
  _flex: ['center'],
  flex: 'none',
  _size: '36px',
  backgroundColor: '$yellowColor',
  borderRadius: '50px',
  marginRight: '18px',
  marginTop: '3px',
  transition: '.2s ease',

  '&:hover': {
    backgroundColor: 'rgba($yellowColor, .7)'
  },

  completed: {
    backgroundColor: '$greenColor',

    '&:hover': {
      backgroundColor: 'rgba($greenColor, .7)'
    }
  },

  loading: {
    backgroundColor: 'transparent',
  }
});

const IconWrapper = element('div', {
  _size: '36px',
  _flex: 'center',

  '& svg': {
    _size: '18px',
    _flex: 'center',
    _svgColor: 'rgba($deepBlue100, .3)',
    transition: '.2s ease',
  },

  '#{hoverRef}:hover & svg': {
    _svgColor: 'rgba($deepBlue100, 1)',
  },

  completed: {
    '& svg': {
      _svgColor: 'white',
    },

    '#{hoverRef}:hover & svg': {
      _svgColor: 'white',
    }
  },

});

const LoaderWrapper = element('div', {
  _size: '36px',
  _alignAbsolute: 0,
  opacity: 0,
  pointerEvents: 'none',
  transition: '.2s ease',

  loading: {
    opacity: 1,
  }
})

class GoalCheckbox extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    setupDelegate(this, 'onGoalCheckboxClick');
  }
  render() {
    const { completed, loading } = this.props;
    
    return (
      <CheckboxWrapper
        completed={completed}
        loading={loading}
        onClick={this.onGoalCheckboxClick}
      >
        <IconWrapper hoverRef={CheckboxWrapper.ref} completed={completed}>
          <Icon icon="ChecklistCheckmark" />
        </IconWrapper>
        <LoaderWrapper loading={loading}>
          <RotateLoader size={36} />
        </LoaderWrapper>
      </CheckboxWrapper>
    )
  }
}

export default GoalCheckbox
// const { string } = PropTypes;
GoalCheckbox.propTypes = {};
