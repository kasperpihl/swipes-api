import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

class HOCLogoutButton extends PureComponent {
  constructor(props) {
    super(props);
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onLogout() {
    const { signout isElectron, confirm } = this.props;
    if(isElectron) {
      const options = { boundingRect: e.target.getBoundingClientRect() };
      confirm({
        ...options,
        title: 'Log out',
        message: 'Do you want to log out?',
      }, (i) => {
        if(i === 1){
          this.doLogout();
        }
      });
    } else {
      const result = window.confirm('Do you want to log out?');
      if(result) this.doLogout();
    }
  }
  doLogout() {
    this.setLoading('loggingout');
    signout(() => {
      this.clearLoading('loggingout');
    });
  }
  renderLoader() {
    return <div>Loading</div>;
  }
  render() {
    const { children } = this.props;
    if(this.getLoading('loggingout')) {
      return this.renderLoader();
    }
    return React.cloneElement(children, {
      onClick: this.onLogout
    })
  }
}
// const { string } = PropTypes;

HOCLogoutButton.propTypes = {};

const mapStateToProps = (state) => ({
  isElectron: state.getIn(['globals', 'isElectron']),
});

export default connect(mapStateToProps, {
  confirm: a.menus.confirm,
  signout: a.main.signout,
})(HOCLogoutButton);