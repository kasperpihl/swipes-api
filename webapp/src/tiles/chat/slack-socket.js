import { bindAll } from '../../classes/utils'

export default class SlackSocket {
  constructor(restartSocket, handleMessage){

    bindAll(this, ['checkSocket', 'sendEvent'])

    if(typeof restartSocket !== 'function'){
      restartSocket = () => {}
      console.warn('SlackSocket constructor takes a restart function as first parameter');
    }
    this.restartSocket = restartSocket;

    
    if(typeof handleMessage === 'function'){
      this.delegateHandleMessage = handleMessage;
    }
    this.handleMessage = (msg) => {
      if(msg.type === 'pong'){
        this.lastPongTime = new Date().getTime();
        return;
      }
      if(this.delegateHandleMessage){
        this.delegateHandleMessage(msg);
      }
    }
    // When window onload, close websocket and make sure not to try to reopen. (reset onclose)
    window.onbeforeunload = () => {
      if(this.webSocket){
        this.webSocket.onclose = function(){};
      }
      this.closeWebSocket();
    }
  }
  connect(url){

    if(!this.webSocket){

      this.webSocket = new WebSocket(url);
      this.webSocket.onopen = () => {
        console.log("slack socket", "open");
      };
      this.webSocket.onclose = () => {
        console.log("slack socket", "close", "now let's reopen");
        this.webSocket = null;
        this.restartSocket();
      };
      this.webSocket.onmessage = (msg) => {
        var data = JSON.parse(msg.data);
        this.handleMessage(data);
      };

      this.webSocket.onerror = () =>{
        console.log('slack socket', 'error');
      }
      if(this.timer){
        clearInterval(this.timer);
      }
      this.timer = setInterval(this.checkSocket, 6000);
    }
  }
  closeWebSocket(){
    // If the websocket exist and is in state OPEN or CONNECTING
    if( this.webSocket && this.webSocket.readyState <= 1 ){
      console.log('closing the socket manually!');
      this.webSocket.close();
      this.webSocket = null;
    }
  }
  sendEvent(msg){
    if(!this.webSocket){
      return this.restartSocket();
    }
    if(this.webSocket.readyState === 0 || this.webSocket.readyState === 2){
      return;
    }
    if(this.webSocket.readyState === 3){
      this.webSocket = null;
      return this.restartSocket();
    }
    
    if(typeof msg !== 'string'){
      try{
        msg = JSON.stringify(msg)
      }
      catch(e){
        msg = ''
      }
    }
    this.webSocket.send(msg);
  }
  checkSocket(){

    // Don't double ping.
    if(this.isPinging){
      return;
    }
    
    // Send a ping to the socket, expect return.
    this.sendEvent(JSON.stringify({'id':'1234', 'type': 'ping'}));
    this.isPinging = true;
    const pingTime = new Date().getTime();
    setTimeout(() => {
      this.isPinging = false;
      if(!this.lastPongTime || this.lastPongTime < pingTime){
        this.closeWebSocket();
      }
    }, 4000);
  }
}