import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading, bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Icon from 'Icon';
import './styles/logout-button.scss'

class HOCLogoutButton extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);

    bindAll(this, ['onLogout']);
  }
  componentDidMount() {
  }
  onLogout(e) {
    const { isElectron, confirm } = this.props;

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
    const { signout } = this.props;
    this.setLoading('loggingout');

    signout(() => {
      this.clearLoading('loggingout');
    });
  }
  renderLoader() {
    return <div>Loading</div>;
  }
  render() {

    return (
      <div className="compatible-logout" onClick={this.onLogout}>
        {this.getLoading('loggingout').loading ? (
          <Icon icon="darkloader" width="12" height="12" className="compatible-logout__loading" />
        ) : (
          <Icon icon="Logout" className="compatible-logout__svg" />
        )}
      </div>
    )
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
