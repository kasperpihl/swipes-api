import React, { Component, PropTypes } from 'react';
import { map, list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindAll, queryStringToObject } from 'classes/utils';
import * as actions from 'actions';
import SWView from 'SWView';
import ConnectRow from './ConnectRow';
import './services.scss';

const authSuccess = [
  `${document.location.origin}`,
  'https://staging.swipesapp.com',
].map(o => `${o}/oauth-success.html`);

class Services extends Component {
  constructor(props, context) {
    super(props, context);
    bindAll(this, ['clickedDisconnect', 'clickedConnect']);
  }
  componentDidMount() {
    // this.checkForDropboxFolder();
  }
  componentDidUpdate() {
    // this.checkForDropboxFolder();
  }
  handleOAuthSuccess(serviceName, params) {
    if (this._handled) {
      return;
    }
    const { handleOAuthSuccess } = this.props;
    handleOAuthSuccess(serviceName, params);
    this._handled = true;
  }
  clickedDisconnect(data) {
    this.props.disconnectService(data.id);
  }
  clickedConnect(data) {
    this._handled = false;
    const { browser } = this.props;
    const serviceName = data.id;
    const url = `${window.location.origin}/v1/services.authorize?service_name=${serviceName}`;

    browser(this.context.target, url, (webview, close) => {
      // .'did-get-redirect-request'
      webview.addEventListener('did-get-redirect-request', (e) => {
        if (authSuccess.find(u => e.newURL.startsWith(u))) {
          const params = queryStringToObject(e.newURL.split('?')[1]);
          this.handleOAuthSuccess(serviceName, params);
          close();
        }
      });
      webview.addEventListener('did-navigate', (e) => {
        if (authSuccess.find(u => e.url.startsWith(u))) {
          const params = queryStringToObject(e.url.split('?')[1]);
          this.handleOAuthSuccess(serviceName, params);
          close();
        }
      });
    });
  }
  checkForDropboxFolder() {
    const { myServices } = this.props;
    const db = myServices.find(s => s.get('service_name') === 'dropbox');

    if (db && !localStorage.getItem('dropbox-folder') && !localStorage.getItem('dropbox-did-ask')) {
      this.props.loadModal({ title: 'Find Dropbox folder', data: { message: 'This will enable you to open files on your local dropbox folder', buttons: ['No', 'Yes'] } }, (res) => {
        if (res && res.button) {
          const folder = window.ipcListener.openDialog({ properties: ['openDirectory'] });
          if (folder) {
            localStorage.setItem('dropbox-folder', folder);
          }
        }
        localStorage.setItem('dropbox-did-ask', true);
      });
    }
  }
  renderConnectedServices() {
    const { myServices: my, services } = this.props;
    const sortedServices = my.sort((a, b) => {
      const res = (a.get('service_name') < b.get('service_name')) ? -1 : 1;
      return res;
    });

    if (!sortedServices.size) {
      return 'No services connected';
    }
    return sortedServices.map((service, i) => {
      const realService = services.get(service.get('service_id'));
      if (!realService) {
        return null;
      }
      const data = {
        id: service.get('id'),
        title: realService.get('title'),
        subtitle: service.get('show_name'),
      };
      return <ConnectRow key={`${service.get('id')}-${i}`} clickedButton={this.clickedDisconnect} data={data} disconnect />;
    });
  }
  renderServicesToConnect() {
    const { services: se } = this.props;
    const sortedKeys = se.sort((k1, k2) => {
      const res = (se.getIn([k1, 'title']) < se.getIn([k2, 'title'])) ? -1 : 1;
      return res;
    }).toArray();

    return sortedKeys.map((service, key) => {
      const data = {
        id: service.get('name'),
        title: service.get('title'),
      };

      return [
        <ConnectRow key={`${service.get('id')}-${key}`} data={data} clickedButton={this.clickedConnect} />,
      ];
    });
  }
  render() {
    return (
      <SWView>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connect new services" />
          {this.renderServicesToConnect()}
        </div>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connected services" />
          {this.renderConnectedServices()}
        </div>
      </SWView>
    );
  }
}

const { func, string } = PropTypes;

Services.propTypes = {
  disconnectService: func,
  myServices: list,
  loadModal: func,
  browser: func,
  handleOAuthSuccess: func,
  services: map,
};
Services.contextTypes = {
  target: string,
};

function mapStateToProps(state) {
  return {
    services: state.getIn(['main', 'services']),
    myServices: state.getIn(['me', 'services']),
  };
}

const ConnectedServices = connect(mapStateToProps, {
  browser: actions.main.browser,
  handleOAuthSuccess: actions.me.handleOAuthSuccess,
  disconnectService: actions.me.disconnectService,
  loadModal: actions.main.modal,
})(Services);
export default ConnectedServices;
