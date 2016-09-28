class Notifications {
  constructor(store) {
    this.store = store
    this.a1 = new Audio('https://s3.amazonaws.com/cdn.swipesapp.com/default.mp3')
    this.a2 = new Audio('https://s3.amazonaws.com/cdn.swipesapp.com/default.mp3')
    store.subscribe(this.storeChange.bind(this))
    this.lastSentTime = new Date().getTime()
  }
  storeChange(){
    const state = this.store.getState();
    const history = state.getIn(['notifications', 'history'])
    if(history && history.length){
      history.forEach( (notification) => {
        if(notification.time > this.lastSentTime){
          if(document.hasFocus()){
            this.playSound();
          }
          else{
            Notification.requestPermission().then((result) => {
              if (result === 'denied') {
                console.log('Permission wasn\'t granted. Allow a retry.');
                return;
              }
              if (result === 'default') {
                console.log('The permission request was dismissed.');
                return;
              }
              let myNotification = new Notification(notification.title, {
                sound: 'https://s3.amazonaws.com/cdn.swipesapp.com/default.mp3',
                body: notification.message
              })
            });
            
          }
          
          this.lastSentTime = notification.time;
        }
      })
    }
  }
  playSound(){
    this.a1.play();
    setTimeout( () => {
      this.a2.play();
    }, 100)
  }
}
export default Notifications