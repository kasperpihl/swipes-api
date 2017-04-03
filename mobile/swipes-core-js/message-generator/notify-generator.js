export default class Notify {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getNotifyTitle(notify) {
    const type = notify.get('notification_type');
    if (notify.get('request')) {
      switch (type) {
        case 'feedback':
          return 'Ask for feedback';
        case 'assets':
          return 'Ask for information';
        case 'decision':
          return 'Ask for decision';
        case 'status':
        default:
          return 'Ask for status update';
      }
    }
    switch (type) {
      case 'feedback':
        return 'Give feedback';
      case 'assets':
        return 'Give assets';
      case 'decision':
        return 'Give a decision';
      case 'status':
      default:
        return 'Give status update';
    }
  }
  getNotifyPopupSubtitle(isRequest, type) {
    if (isRequest) {
      return {
        status: 'Ask your teammates for an update',
        feedback: 'Gather feedback from the team',
        assets: 'Request additional information',
        decision: 'Ask for a choice or a decision',
      }[type];
    }
    return {
      status: 'Give your teammates an update',
      feedback: 'Share your feedback on this goal',
      assets: 'Notify your teammates about new information',
      decision: 'Let your teammates know about a decisions',
    }[type];
  }
  getNotifySubtitle(notify) {
    const type = notify.get('notification_type');
    if (notify.get('request')) {
      switch (type) {
        case 'feedback':
        case 'assets':
        case 'decision':
        case 'status':
        default:
      }
    }
    switch (type) {
      case 'feedback':
      case 'assets':
      case 'decision':
      case 'status':
      default:
    }
  }
  getWriteMessagePlaceholder(notify) {
    const type = notify.get('notification_type');
    if (notify.get('request')) {
      switch (type) {
        case 'feedback':
          return 'Ask your teammates for their opinion on your work so far. Are there any improvements you should make or is it ready?';
        case 'assets':
          return 'Ask your teammates for additional information. Let them know why you need this file or document and how it will help you move forward.';
        case 'decision':
          return 'Share your work and ask your teammates to take a decision.';
        case 'status':
        default:
          return 'Ask your teammates for an update and if you refer to a file.';


      }
    }
    switch (type) {
      case 'feedback':
        return 'Share your feedback on the work so far. What do you think is good? What needs further improvement?';
      case 'assets':
        return 'Notify your teammates if you have updated a note or added any new uploads and files. This will help everyone stay aligned on the latest progress.';
      case 'decision':
        return 'Let your teammates know about a decision.';
      case 'status':
      default:
        return 'Give your teammates an update. What is the latest on this step and the goal?';
    }
  }

  getFooterForHandoff(handoff) {
    const state = this.store.getState();
    const myName = this.parent.users.getName(state.getIn(['me', 'id']), { disableYou: true });
    if (!handoff.toId) {
    }
    return myName;
    // Awesome, you just completed <span>“3. Design Elements”</span>. Do you want to leave a message to <span>Yana</span>?
  }
}
