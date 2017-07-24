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
      case 'post':
      default:
        return 'Make a post';
    }
  }
  getPrefixForType(type) {
    switch (type) {
      case 'information':
        return '';
      case 'announcement':
        return 'an ';
      case 'question':
      case 'post':
      default:
        return 'a ';
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
      case 'post':
      default:
        return 'made a post';
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
      case 'post':
      default:
        return 'Share the latest with the team';
    }
  }
}
