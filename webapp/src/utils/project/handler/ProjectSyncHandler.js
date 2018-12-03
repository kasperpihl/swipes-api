import debounce from 'swipes-core-js/utils/debounce';
import request from 'swipes-core-js/utils/request';
import randomString from 'swipes-core-js/utils/randomString';

export default class ProjectKeyHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.deletedIds = [];
  }
  // stateManager will set this, once an update happens.
  convertToServerState() {
    const { clientState } = this.state;
    const serverKeys = ['order', 'indent', 'completion', 'itemsById'];
    const server = {};

    if (clientState.get('name') !== this.currentServerState.get('name')) {
      server.name = name;
    }
    serverKeys.forEach(key => (server[key] = {}));

    clientState.get('sortedOrder').forEach(taskId => {
      // Client values
      const cOrder = clientState.getIn(['order', taskId]);
      const cIndent = clientState.getIn(['indent', taskId]);
      const cCompletion = clientState.getIn(['completion', taskId]);
      const cItem = clientState.getIn(['itemsById', taskId]);

      // Server values
      const sOrder = this.currentServerState.getIn(['order', taskId]);
      const sIndent = this.currentServerState.getIn(['indent', taskId]);
      const sCompletion = this.currentServerState.getIn(['completion', taskId]);
      const sItem = this.currentServerState.getIn(['itemsById', taskId]);

      if (sOrder !== cOrder) {
        server.order[taskId] = cOrder;
      }
      if (sIndent !== cIndent) {
        server.indent[taskId] = cIndent;
      }
      if (
        (typeof sCompletion === 'undefined' && cCompletion) ||
        (sCompletion && !cCompletion)
      ) {
        server.completion[taskId] = cCompletion;
      }

      if (sItem !== cItem) {
        server.itemsById[taskId] = cItem.toJS();
      }
    });

    this.deletedIds.forEach(id => {
      server.itemsById[id] = null;
      server.indent[id] = null;
      server.order[id] = null;
      server.completion[id] = null;
    });

    serverKeys.forEach(
      key => !Object.keys(server[key]).length && delete server[key]
    );
    console.log(server);
    if (Object.keys(server).length) {
      server.project_id = 'A123131';
      server.rev = this.currentServerState.get('rev');
      server.update_identifier = randomString(6);
      // request('project.sync', server).then(res => {
      //   if (res.ok) {
      //     this.mergeNewServerVersion(res.updates2[0], server);
      //   }
      // });
    }
  }
  mergeNewServerVersion(newServerState, localChanges) {
    // 1. Get a merged server state
    // 2. Get local server changes based on merged server state
    // 3. Generate new local state based on merged server state and local changes
    // 4. Save merged server state as this.serverState
    // 5. If local changes, save them!
    if (newServerState.rev > this.serverState.rev) {
      // this.serverState.rev = newServerState.rev;
    }
    Object.assign(this.serverState.order, newServerState.order);
    Object.assign(this.serverState.completion, newServerState.completion);
    Object.assign(this.serverState.indent, newServerState.indent);
    for (let key in newServerState.itemsById) {
      const item = newServerState.itemsById[key];
      if (item.deleted) {
        delete this.serverState.order[key];
        delete this.serverState.indent[key];
        delete this.serverState.completion[key];
        delete this.serverState.itemsById[key];
      }
    }
    console.log(newServerState);
  }
  delete = id => {
    this.deletedIds.push(id);
  };
  checkForChanges = () => {
    this.convertToServerState();
  };
  bouncedCheckForChanges = debounce(this.checkForChanges, 5000);
  setState = state => {
    if (!this.state) {
      this.currentServerState = state.clientState;
    }
    this.state = state;
    this.bouncedCheckForChanges();
  };
}
