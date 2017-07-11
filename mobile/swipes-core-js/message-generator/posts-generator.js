export default class Posts {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getPostComposeTypeTitle(type) {
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
  getPostTypeTitle(type) {
    switch (type) {
      case 'information':
        return 'shared information';
      case 'question':
        return 'asked a question';
      case 'announcement':
        return 'made an announcement';
      case 'message':
      default:
        return 'sent a message';
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
