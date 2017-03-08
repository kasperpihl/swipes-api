import deepEqual from 'deep-equal';
import { randomString } from 'classes/utils';

const isEqualBlocks = (block1, block2, entityMap1, entityMap2) => {
  // Check direct comparable stuff
  if (
    block1.text !== block2.text ||
    block1.depth !== block2.depth ||
    block1.type !== block2.type ||
    block1.inlineStyleRanges.length !== block2.inlineStyleRanges.length ||
    block1.entityRanges.length !== block2.entityRanges.length ||
    !deepEqual(block1.data, block2.data)
  ) {
    return false;
  }
  let hasDiff = false;
  block1.inlineStyleRanges.forEach((b1i, i) => {
    if (!hasDiff) {
      const b2i = block2.inlineStyleRanges[i];
      if (!deepEqual(b1i, b2i)) {
        hasDiff = true;
      }
    }
  });
  block1.entityRanges.forEach((er1, i) => {
    if (!hasDiff) {
      const er2 = block2.entityRanges[i];
      if (er1.offset !== er2.offset || er1.length !== er2.length) {
        hasDiff = true;
      } else {
        const e1 = entityMap1[er1.key];
        const e2 = entityMap2[er2.key];
        if (!deepEqual(e1, e2)) {
          hasDiff = true;
        }
      }
    }
  });
  if (hasDiff) {
    return false;
  }

  return true;
};

const bumpOffsets = (block, bump) => {
  block.entityRanges.forEach((er) => {
    er.offset += bump;
  });
  block.inlineStyleRanges.forEach((isr) => {
    isr.offset += bump;
  });
};

export default function diff(serverOrg, serverMod, clientMod) {
  const orgBlocks = {};

  serverOrg.blocks.forEach((b) => {
    orgBlocks[b.key] = b;
  });

  const getChanges = (eState) => {
    const diffObj = {
      edited: {},
      added: [],
      allKeys: {},
      entityMap: eState.entityMap,
    };
    let lastKnown = null;
    eState.blocks.forEach((b) => {
      if (orgBlocks[b.key]) {
        lastKnown = b.key;
        if (!isEqualBlocks(orgBlocks[b.key], b, serverOrg.entityMap, eState.entityMap)) {
          diffObj.edited[b.key] = b;
        }
      } else {
        diffObj.added.push({
          block: b,
          insertAfter: lastKnown,
        });
      }
      diffObj.allKeys[b.key] = true;
    });

    return diffObj;
  };

  const serverChanges = getChanges(serverMod);
  const clientChanges = getChanges(clientMod);

  const newState = {
    blocks: [],
    entityMap: {},
  };
  let entityCounter = 0;
  const addBlockToState = (block, entityMap) => {
    if (block.entityRanges.length) {
      block.entityRanges = block.entityRanges.map((en) => {
        newState.entityMap[entityCounter] = entityMap[en.key];
        en.key = entityCounter;
        entityCounter += 1;
        return en;
      });
    }
    newState.blocks.push(block);
  };
  const addForKey = (key) => {
    let didInsert;
    do {
      didInsert = false;
      let blockCO = false;
      let sO = serverChanges.added[0];
      if (sO && sO.insertAfter !== key) {
        sO = undefined;
      }
      let cO = clientChanges.added[0];
      if (cO && cO.insertAfter !== key) {
        cO = undefined;
      }
      if (sO) {
        const cEnt = clientChanges.entityMap;
        const sEnt = serverChanges.entityMap;
        if (!cO || !isEqualBlocks(cO.block, sO.block, cEnt, sEnt)) {
          blockCO = true;
          addBlockToState(sO.block, serverChanges.entityMap);
          didInsert = true;
        }
        serverChanges.added.shift();
      }
      if (!blockCO && cO) {
        didInsert = true;
        addBlockToState(cO.block, clientChanges.entityMap);
        clientChanges.added.shift();
      }
    } while (didInsert);
  };

  let numberOfConflicts = 0;
  serverOrg.blocks.forEach((b, i) => {
    let deletedBlock = false;
    if (!serverChanges.allKeys[b.key] || !clientChanges.allKeys[b.key]) {
      if (!serverChanges.edited[b.key] && !clientChanges.edited[b.key]) {
        deletedBlock = true;
      }
    }
    if (i === 0) {
      addForKey(null);
    }

    if (!deletedBlock) {
      const serEdit = serverChanges.edited[b.key];
      const cliEdit = clientChanges.edited[b.key];
      if (!serEdit && !cliEdit) {
        addBlockToState(b, serverOrg.entityMap);
      } else if (serEdit && cliEdit) {
        if (isEqualBlocks(serEdit, cliEdit, serverChanges.entityMap, clientChanges.entityMap)) {
          addBlockToState(serEdit, serverChanges.entityMap);
        } else {
          numberOfConflicts += 1;
          const serPre = '[CONFLICT]';
          serEdit.text = `${serPre} ${serEdit.text}`;
          bumpOffsets(serEdit, serPre.length + 1);

          addBlockToState(serEdit, serverChanges.entityMap);
          cliEdit.key = randomString(5);
          const cliPre = '[YOU WROTE]';
          cliEdit.text = `${cliPre} ${cliEdit.text}`;
          bumpOffsets(cliEdit, cliPre.length + 1);
          addBlockToState(cliEdit, clientChanges.entityMap);
        }
      } else if (serEdit) {
        addBlockToState(serEdit, serverChanges.entityMap);
      } else {
        addBlockToState(cliEdit, clientChanges.entityMap);
      }
    }

    addForKey(b.key);
  });

  return {
    conflicts: numberOfConflicts,
    editorState: newState,
  };
}
