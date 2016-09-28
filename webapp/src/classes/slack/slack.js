import { bindAll } from '../utils'
import Subscriber from '../subscriber'

import { request } from '../../actions/api'
import { sendNotification } from '../../actions/main'
import SlackCoreHandler from './slack-core-handler'

export default class Slack {
  constructor(store){
    this.store = store;
    bindAll(this, ['storeChange', 'request', 'delegate', 'connect', 'disconnect', 'onNotification', 'onProfilePic'])
    store.subscribe(this.storeChange)
    this.subscriber = new Subscriber();
    this.currentHandlers = {};
  }
  onNotification(msg){
    console.log('on notification');
    this.store.dispatch(sendNotification(msg));
    //this.swipes.sendEvent('notifications.send', {title: channel.name, message: text});
  }
  onProfilePic(pic){
    var state = this.store.getState();
    const curr = state.getIn(['me', 'profile_pic']);
    if(pic !== curr){
      this.store.dispatch(request('users.profilePic', {profile_pic: pic}));
    }
  }
  request(serviceId, method, data){
    var options = {
      service: 'slack',
      account_id: serviceId,
      data: {
        method,
        parameters: data
      }
    };
    return this.store.dispatch(request("services.request", options));
  }
  connect(serviceId, listener, ctx){
    this.subscriber.add(serviceId, listener, ctx);
    var handler = this.currentHandlers[serviceId];
    if(handler && handler.slackData){
      listener('init', handler.slackData.getData());
    }
  }
  sendEvent(serviceId, msg){

    var handler = this.currentHandlers[serviceId];
    if(handler){
      handler.socket.sendEvent(msg);
    }
  }
  disconnect(serviceId, listener, ctx){
    this.subscriber.remove(serviceId, listener, ctx);
  }
  delegate(serviceId, method){
    this.subscriber.notify.apply(null, [serviceId].concat(Array.prototype.slice.call(arguments, 1)))
  }
  storeChange(){
    const state = this.store.getState();
    const services = state.getIn(['me', 'services']);
    if(services){
      services.filter( s => s.get('service_name') === 'slack').map((service) => {
        const id = service.get('id');
        if(!this.currentHandlers[id]){
          this.currentHandlers[id] = new SlackCoreHandler(this.delegate.bind(null, id), this.request.bind(null, id));
          this.currentHandlers[id].onNotification = this.onNotification;
          this.currentHandlers[id].onProfilePic = this.onProfilePic;
        }
      })
    }

  }
}
