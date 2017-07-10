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
        return 'Articles, ideas, knowledge and funny videos';
      case 'question':
        return 'For feedback, assets or updates etc.';
      case 'announcement':
        return 'Announce important events!';
      case 'message':
      default:
        return 'Share an update with the team';
    }
  }
}
