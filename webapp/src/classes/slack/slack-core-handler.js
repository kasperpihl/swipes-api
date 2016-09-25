import { bindAll, indexBy } from '../../classes/utils'
import SlackSocket from './slack-socket'
import CoreSlackData from './core-slack-data'

export default class SlackCoreHandler {
  constructor(delegate, request){
    this.delegate = delegate;
    this.request = request;

    bindAll(this, ['start', 'handleMessage', 'destroy'])
    this.socket = new SlackSocket(this.start, this.handleMessage);
    this.start();
  }
  destroy(){
    this.socket.destroy();
    this.delegate = () => {}
  }
  clearDelegate(){
    this.delegate = () => {};
  }
  handleMessage(msg){
    if(this.slackData){
      this.slackData.handleMessage(msg);
    }
    this.delegate('socketMessage', msg)
  }
  start(){
    if(this.isStarting){
      return;
    }
    this.isStarting = true;
    this.request('rtm.start').then((res, err) => {
      this.isStarting = false;
      if(res.ok){
        const saveObj = { channels: {} };
        const keysToSave = [ 'team', 'users', 'self', 'bots', 'channels', 'groups', 'ims' ]
        Object.keys(res.data).forEach((key) => {
          if(keysToSave.indexOf(key) !== -1){
            let value = res.data[key];
            if(Array.isArray(value)){
              value = indexBy(value, (obj) => obj.id)
              if(['channels', 'groups', 'ims'].indexOf(key) > -1){
                key = 'channels';
                value = Object.assign(saveObj['channels'], value);
              }
            }
            saveObj[key] = value;
          }
        });
        this.slackData = new CoreSlackData(saveObj);
        this.slackData.onNotification = this.onNotification;
        this.delegate('init', saveObj);
        this.socket.connect(res.data.url);
      }
    })
  }
}
