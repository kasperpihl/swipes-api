import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

class HOCNoMilestone extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    // setupLoading(this);
  }
  onClick() {
    const { navPush } = this.props;
    navPush({
      id: 'NoMilestoneOverview',
      title: 'No Milestone',
    });
  }
  componentDidMount() {
  }
  render() {
    const { counter } = this.props;
    return (
      <div onClick={this.onClick}>{counter}</div>
    );
  }
}
// const { string } = PropTypes;

HOCNoMilestone.propTypes = {};

const mapStateToProps = (state) => ({
  counter: cs.goals.withoutMilestone(state).size,
});

export default navWrapper(connect(mapStateToProps, {
})(HOCNoMilestone));
