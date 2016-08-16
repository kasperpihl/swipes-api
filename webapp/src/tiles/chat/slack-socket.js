import { bindAll } from '../../classes/utils'

export default class SlackSocket {
  constructor(start){
    // When window onload, close websocket and make sure not to try to reopen. (reset onclose)
    if(typeof start !== 'function'){
      start = () => {}
      console.warn('SlackSocket constructor takes a start function as parameter');
    }
    this.start = start;
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
        this.start();
      };
      this.webSocket.onmessage = (msg) => {
        var data = JSON.parse(msg.data);
        this.onHandleMessage(data);
      };

      this.webSocket.onerror = () =>{
        console.log('slack socket', 'error');
      }
      if(this.timer){
        clearInterval(this.timer);
      }
      this.timer = setInterval(this.checkSocket.bind(this), 6000);
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
  checkSocket(){

    // Don't double ping.
    if(this.isPinging){
      return;
    }
    
    // If no websocket - run rtm.start again.
    if(!this.webSocket){
      return this.start();
    }

    // State is CONNECTING or CLOSING - Don't interfere
    if(this.webSocket.readyState === 0 || this.webSocket.readyState === 2){
      return;
    }
    // If state is CLOSED, remove webSocket variable and run rtm.start again.
    if(this.webSocket.readyState === 3){
      this.webSocket = null;
      return this.start();
    }
    // Send a ping to the socket, expect return.
    this.webSocket.send(JSON.stringify({'id':'1234', 'type': 'ping'}));
    this.isPinging = true;
    var ping = new Date().getTime();
    setTimeout(() => {
      this.isPinging = false;
      if(!this.lastPong || this.lastPong < ping){
        this.closeWebSocket();
      }
    }, 4000);
  }
}