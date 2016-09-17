import { bindAll } from '../utils'
import Subscriber from '../subscriber'

import { request } from '../../actions/api'
import SlackCoreHandler from './slack-core-handler'

export default class Slack {
  constructor(store){
    this.store = store;
    bindAll(this, ['storeChange', 'request', 'delegate'])
    store.subscribe(this.storeChange)
    this.subscriber = new Subscriber();
    this.currentHandlers = {};
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
    var handler = this.currentHandlers[service.id];
    if(handler && handler.slackData){
      listener('init', handler.slackData.getData());
    }
  }
  disconnect(serviceId, listener, ctx){
    this.subscriber.remove(serviceId, listener, ctx);
  }
  delegate(serviceId, method){
    this.subscriber.notify.apply(null, [serviceId].concat(Array.prototype.slice.call(arguments, 1)))
    console.log('delegate', serviceId, method);
  }
  storeChange(){
    const state = this.store.getState();
    if(state.me){
      const services = state.me.services;
      services.filter( s => s.service_name === 'slack').map((service) => {
        if(!this.currentHandlers[service.id]){
          this.currentHandlers[service.id] = new SlackCoreHandler(this.delegate.bind(null, service.id), this.request.bind(null, service.id));
        }
      })
    }
    
  }
}