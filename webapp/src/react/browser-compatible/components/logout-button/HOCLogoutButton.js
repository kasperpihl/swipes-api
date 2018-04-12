import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import * as a from 'actions';
import { setupLoading, bindAll } from 'swipes-core-js/classes/utils';
import RotateLoader from 'components/loaders/RotateLoader';
import Icon from 'Icon';
import styles from './LogoutButton.swiss';

const LogoutButtonWrapper = styleElement('div', styles, 'LogoutButtonWrapper');
const Label = styleElement('div', styles, 'Label');
const Loader = styleElement('div', styles, 'Loader');

class HOCLogoutButton extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);

    bindAll(this, ['onLogout']);
  }
  onLogout(e) {
    const { isElectron, confirm } = this.props;

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
      <LogoutButtonWrapper loading={this.isLoading('loggingout')} onClick={this.onLogout}>
        <Loader loading={this.isLoading('loggingout')}>
          <RotateLoader size={36} />
        </Loader>  
        <Label loading={this.isLoading('loggingout')}>Log out</Label>
      </LogoutButtonWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  isElectron: state.getIn(['globals', 'isElectron']),
});

export default connect(mapStateToProps, {
  confirm: a.menus.confirm,
  signout: a.main.signout,
})(HOCLogoutButton);
