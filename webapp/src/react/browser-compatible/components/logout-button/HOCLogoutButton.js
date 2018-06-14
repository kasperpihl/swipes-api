import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SwissProvider } from 'swiss-react';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import { setupLoading, bindAll } from 'swipes-core-js/classes/utils';
import RotateLoader from 'components/loaders/RotateLoader';
import SW from './LogoutButton.swiss';

@connect(state => ({
  isElectron: state.getIn(['globals', 'isElectron']),
}), {
  confirm: menuActions.confirm,
  signout: mainActions.signout,
})

export default class extends PureComponent {
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
      <SwissProvider loading={this.isLoading('loggingout')}>
        <SW.Wrapper onClick={this.onLogout}>
          <SW.Loader>
            <RotateLoader size={36} />
          </SW.Loader>
          <SW.Label>Log out</SW.Label>
        </SW.Wrapper>
      </SwissProvider>
    )
  }
}
