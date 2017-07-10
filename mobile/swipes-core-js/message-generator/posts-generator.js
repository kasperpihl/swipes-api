export default class Posts {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getPostTypeTitle(type) {
    switch (type) {
      case 'information':
        return 'Share information';
      case 'question':
        return 'Ask a question';
      case 'announcement':
        return 'Make an announcement';
      case 'message':
      default:
        return 'Send a message';
    }
  }
  getPostTypeSubtitle(type){
    switch (type) {
      case 'information':
        return 'Articles, knowledge and funny videos';
      case 'question':
        return 'Ask for feedback, assets or other stuff';
      case 'announcement':
        return 'Announce important events!';
      case 'message':
      default:
        return 'Share an update with the team';
    }
  }
}
