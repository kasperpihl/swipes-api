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
    if(state.notifications.length){
      state.notifications.forEach( (notification) => {
        if(notification.time > this.lastSentTime){
          this.playSound();
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