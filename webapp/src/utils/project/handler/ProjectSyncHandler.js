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
    const serverKeys = ['order', 'indent', 'completion', 'itemsById'];
    const server = {};

    if (name !== this.serverState.getIn(['project', 'name'])) {
      server.name = name;
    }
    serverKeys.forEach(key => (server[key] = {}));

    order.forEach((o, i) => {
      const id = o.get('id');

      // Server values
      const sOrder = this.serverState.getIn(['project', 'order', id]);
      const sIndent = this.serverState.getIn(['project', 'indent', id]);
      const sCompletion = this.serverState.getIn(['project', 'completion', id]);

      if (sOrder !== i) {
        server.order[id] = i;
      }
      if (sIndent !== o.get('indent')) {
        server.indent[id] = o.get('indent');
      }
      if (
        (typeof sCompletion === 'undefined' && o.get('completion')) ||
        (sCompletion && !o.get('completion'))
      ) {
        server.completion[id] = o.get('completion');
      }

      if (this.serverState.getIn(['itemsById', id]) !== itemsById.get(id)) {
        server.itemsById[id] = {
          title: itemsById.get(id).get('title')
        };
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
      server.rev = this.serverState.getIn(['project', 'rev']);
      server.update_identifier = randomString(6);
      request('project.sync', server).then(res => {
        if (res.ok) {
          this.mergeNewServerVersion(res.updates2[0], server);
        }
      });
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
    // this.convertToServerState();
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
