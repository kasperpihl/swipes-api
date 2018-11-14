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
    const { order, itemsById, name } = this.state;
    const serverKeys = ['order', 'indent', 'completion', 'items'];
    const server = {};
    serverKeys.forEach(key => (server[key] = {}));

    order.forEach((o, i) => {
      const id = o.get('id');
      if (this.serverState.getIn(['project', 'order', id]) !== i) {
        server.order[id] = i;
      }
      if (
        this.serverState.getIn(['project', 'indent', id]) !== o.get('indent')
      ) {
        server.indent[id] = o.get('indent');
      }
      if (
        this.serverState.getIn(['project', 'completion', id]) !==
        o.get('completion')
      ) {
        server.completion[id];
      }

      if (this.serverState.getIn(['itemsById', id]) !== itemsById.get(id)) {
        server.items[id] = {
          title: itemsById.get(id).get('title')
        };
      }
    });

    this.deletedIds.forEach(id => {
      server.items[id] = null;
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
      server.update_identifier = randomString(6);
      request('project.sync', server);
    }
  }
  delete = id => {
    this.deletedIds.push(id);
  };
  checkForChanges = () => {
    this.convertToServerState();
  };
  setRawServerState = serverState => {
    if (!this.serverState) {
      this.serverState = serverState;
    }
  };
  bouncedCheckForChanges = debounce(this.checkForChanges, 5000);
  setState = state => {
    this.state = state;
    if (!this.prevState) {
      this.prevState = state;
    }
    this.bouncedCheckForChanges();
  };
}
