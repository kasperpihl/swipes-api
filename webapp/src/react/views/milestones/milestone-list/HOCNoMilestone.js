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
import Icon from 'Icon';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import './styles/no-milestone.scss';

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
  renderHeader() {

    return (
      <div className="header">
        <div className="header__left">
          <div className="header__title">Goals with no milestone</div>
        </div>
        <div className="header__icon">
          <Icon icon="ArrowRightLong" className="header__svg" />
        </div>
      </div>
    )
  }
  renderBody() {
    const { counter } = this.props;

    return (
      <div className="no-milestone-item__body">
        <div className="no-milestone-item__subtitle">{counter}</div>
        <Icon icon="NoMilestone" className="no-milestone-item__svg" />
        <div className="no-milestone-item__circle">
          <div className="no-milestone-item__dot" />
        </div>
      </div>
    )
  }
  render() {
    const { counter } = this.props;
    return (
      <div className="no-milestone-item" onClick={this.onClick}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
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
