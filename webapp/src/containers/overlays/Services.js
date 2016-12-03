import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindAll } from '../../classes/utils';
import { modal, me } from '../../actions';
import ConnectRow from '../../components/services/ConnectRow';
import '../../components/services/services.scss';

/* global nodeRequire, ipcListener */

const { dialog } = nodeRequire('electron').remote;

class Services extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['clickedDisconnect', 'clickedConnect']);
  }
  componentDidMount() {
    this.checkForDropboxFolder();
  }
  componentDidUpdate() {
    this.checkForDropboxFolder();
  }
  clickedDisconnect(data) {
    this.props.disconnectService(data.id);
  }
  clickedConnect(data) {
    ipcListener.sendEvent('oauth-init', {
      serviceName: data.id,
      url: `${window.location.origin}/v1/services.authorize?service_name=${data.id}`,
    });
  }
  checkForDropboxFolder() {
    const { myServices } = this.props;
    const db = myServices.find(s => s.get('service_name') === 'dropbox');

    if (db && !localStorage.getItem('dropbox-folder') && !localStorage.getItem('dropbox-did-ask')) {
      this.props.loadModal({ title: 'Find Dropbox folder', data: { message: 'This will enable you to open files on your local dropbox folder', buttons: ['No', 'Yes'] } }, (res) => {
        if (res && res.button) {
          const folder = dialog.showOpenDialog({ properties: ['openDirectory'] });
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

      return res.toArray();
    });

    return sortedKeys.map((service, key) => {
      const data = {
        id: service.get('name'),
        title: service.get('title'),
      };
      let placeholderText;
      if (service.get('name') === 'dropbox') {
        placeholderText = 'By connecting Dropbox, you will get a stream of notifications for recently updated or uploaded files by you or your colleagues. Also you will be able to search and find files from there ~30min after connecting the service.';
      }
      if (service.get('name') === 'asana') {
        placeholderText = 'By connecting Asana, you will get a stream of notifications for recently updated or added tasks by you or your colleagues.';
      }
      if (service.get('name') === 'slack') {
        placeholderText = 'By connecting Slack, you can add a chat tile in your Workspace from where you can easily communicate with your team, share information and progress on your work.';
      }

      return [
        <ConnectRow key={`${service.get('id')}-${key}`} data={data} clickedButton={this.clickedConnect} />,
        <div className="swipes-services__placeholder swipes-services__placeholder--connect" key={`placeholder${key}`} >
          {placeholderText}
        </div>,
      ];
    });
  }
  render() {
    return (
      <div className="scroll-container">
        <div className="swipes-services__placeholder">
          Below are a set of services, integrated with the Swipes Workspace.
          We support multiple accounts from each service and you can add different
          Slack, Dropbox or Asana accounts for the different teams or companies you work with.
        </div>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connect new services" />
          {this.renderServicesToConnect()}
        </div>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connected services" />
          {this.renderConnectedServices()}
        </div>
      </div>
    );
  }
}

const { func, array } = PropTypes;

Services.propTypes = {
  disconnectService: func,
  myServices: array,
  loadModal: func,
  services: map,
};

function mapStateToProps(state) {
  return {
    services: state.get('services'),
    myServices: state.getIn(['me', 'services']),
  };
}

const ConnectedServices = connect(mapStateToProps, {
  disconnectService: me.disconnectService,
  loadModal: modal.load,
})(Services);
export default ConnectedServices;
