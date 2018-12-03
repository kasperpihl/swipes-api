import debounce from 'swipes-core-js/utils/debounce';
import request from 'swipes-core-js/utils/request';
import randomString from 'swipes-core-js/utils/randomString';

export default class ProjectKeyHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.deletedIds = [];
    this.myUpdates = {};
  }
  // stateManager will set this, once an update happens.
  convertToServerState() {
    const { clientState } = this.state;
    const serverKeys = ['ordering', 'indention', 'completion', 'itemsById'];
    const server = {};

    if (clientState.get('name') !== this.currentServerState.get('name')) {
      server.name = name;
    }
    serverKeys.forEach(key => (server[key] = {}));

    clientState.get('sortedOrder').forEach(taskId => {
      // Client values
      const cOrder = clientState.getIn(['ordering', taskId]);
      const cIndent = clientState.getIn(['indention', taskId]);
      const cCompletion = clientState.getIn(['completion', taskId]);
      const cItem = clientState.getIn(['itemsById', taskId]);

      // Server values
      const sOrder = this.currentServerState.getIn(['ordering', taskId]);
      const sIndent = this.currentServerState.getIn(['indention', taskId]);
      const sCompletion = this.currentServerState.getIn(['completion', taskId]);
      const sItem = this.currentServerState.getIn(['itemsById', taskId]);

      if (sOrder !== cOrder) {
        server.order[taskId] = cOrder;
      }
      if (sIndent !== cIndent) {
        server.indent[taskId] = cIndent;
      }
      if ((!sCompletion && cCompletion) || (sCompletion && !cCompletion)) {
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

    if (Object.keys(server).length) {
      server.project_id = 'A123131';
      server.rev = this.currentServerState.get('rev');
      server.update_identifier = randomString(6);
      this.myUpdates[server.update_identifier] = true;
      request('project.sync', server).then(res => {
        if (res.ok) {
          this.currentServerState = clientState.set('rev', server.rev + 1);
        }
      });
    }
  }
  mergeNewServerVersion(newServerState, updateIdentifier) {
    if (this.myUpdates[updateIdentifier]) {
      return delete this.myUpdates[updateIdentifier];
    }
    this.currentServerState = this.currentServerState.mergeDeep(newServerState);
    let { clientState } = this.state;
    clientState = clientState.mergeDeep(newServerState);
    this.stateManager.update({ clientState });
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
