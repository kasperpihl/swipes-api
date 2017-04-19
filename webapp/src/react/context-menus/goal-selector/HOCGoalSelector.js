import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

import GoalRow from './GoalRow';
import './styles/goal-selector.scss';

class HOCGoalSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: fromJS([
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ]),
    };
    setupLoading(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        options: this.state.options.setIn([0, 'loading'], true),
      });
    }, 5000);
  }
  render() {
    const props = {
      options: this.state.options.toJS(),
      optionComponent: GoalRow,
      optionClassName: 'Select-goal-row',
    }
    return (
      <div className="goal-selector">
        <Creatable
          {...props}
        />
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCGoalSelector.propTypes = {};

function mapStateToProps(state) {
  return {
    goals: state.get('goals')
  };
}

export default connect(mapStateToProps, {
})(HOCGoalSelector);
