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
      return <ConnectRow key={service.id + '-' + i} data={data} clickedButton={this.clickedConnect}/>;
    })
  }
  render() {
    return (
      <div className="scroll-container">
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
