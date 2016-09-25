import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindAll } from '../classes/utils'
import * as actions from '../actions'
import ConnectRow from '../components/services/ConnectRow'
import '../components/services/services.scss'

class Services extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['clickedDisconnect', 'clickedConnect'])
  }
  clickedDisconnect(data){
    this.props.disconnectService(data.id);
  }
  clickedConnect(data){
    ipcListener.sendEvent('oauth-init', {
      serviceName: data.id,
      url: window.location.origin + '/v1/services.authorize?service=' + data.id
    });
  }
  renderConnectedServices(){
    const { myServices:my, services } = this.props;
    const sortedServices = my.sort((a, b) => (a.service_name < b.service_name) ? -1 : 1);

    if(!sortedServices.length){
      return "No services connected";
    }
    return sortedServices.map((service, i) =>{
      var realService = services[service.service_id];
      if(!realService){
        return null;
      }
      const data = {
        id: service.id,
        title: realService.title,
        subtitle: service.show_name
      };
      return <ConnectRow key={service.id + '-' + i} clickedButton={this.clickedDisconnect} data={data} disconnect={true} />;
    })
  }
  renderServicesToConnect(){
    const { services:se } = this.props;
    const sortedKeys = Object.keys(se).sort((k1, k2) => (se[k1].title < se[k2].title) ? -1 : 1)

    return sortedKeys.map((key, i) => {
      const service = se[key];
       const data = {
        id: service.manifest_id,
        title: service.title
      };
      let placeholderText;
      if(service.manifest_id === 'dropbox'){
        placeholderText = "By connecting Dropbox, you will get a stream of notifications for recently updated or uploaded files by you or your colleagues. Also you will be able to search and find files from there ~30min after connecting the service.";
      }
      if(service.manifest_id === 'asana'){
        placeholderText = "By connecting Asana, you will get a stream of notifications for recently updated or added tasks by you or your colleagues.";
      }
      if(service.manifest_id === 'slack'){
        placeholderText = "By connecting Slack, you can add a chat tile in your Workspace from where you can easily communicate with your team, share information and progress on your work.";
      }

      return [
        <ConnectRow key={service.id + '-' + i} data={data} clickedButton={this.clickedConnect}/>,
        <div className="swipes-services__placeholder swipes-services__placeholder--connect" key={"placeholder" + i} >
          {placeholderText}
        </div>
      ];
    })
  }
  render() {
    return (
      <div className="scroll-container">
        <div className="swipes-services__placeholder">Below are a set of services, integrated with the Swipes Workspace. We support multiple accounts from each service and you can add different Slack, Dropbox or Asana accounts for the different teams or companies you work with.</div>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connect new services"></div>
          {this.renderServicesToConnect()}
        </div>
        <div className="swipes-services">
          <div className="swipes-services__title" data-title="Connected services"></div>
          {this.renderConnectedServices()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: state.services,
    myServices: state.me.services
  }
}

const ConnectedServices = connect(mapStateToProps, {
  disconnectService: actions.me.disconnectService
})(Services)
export default ConnectedServices
