import {
  DefaultDraftBlockRenderMap,
  EditorState,
  CompositeDecorator,
} from 'draft-js';
import Subscriber from 'swipes-core-js/classes/subscriber';

const standardIterators = [
  'blockRendererFn',
  'handleBeforeInput',
  'handleKeyCommand',
  'handleReturn',
  'keyBindingFn',
  'onEnter',
  'onChange',
  'onDownArrow',
  'onEsc',
  'onTab',
  'onUpArrow',
  'onBlur',
];

const generateBlockRenderMaps = (blocks) => {
  let renderMap = DefaultDraftBlockRenderMap;
  blocks.forEach((b) => {
    if (typeof b.blockRenderMap === 'function') {
      renderMap = renderMap.merge(b.blockRenderMap());
    }
  });
  return renderMap;
};

export default function Setup(ctx, plugins = {}) {
  const subscriber = new Subscriber();
  if (typeof ctx !== 'object') {
    return console.warn('DraftExt: First argument (ctx) must be an object');
  }
  if (typeof ctx.setEditorState !== 'function') {
    return console.warn('DraftExt: First argument (ctx) must have setEditorState function');
  }
  if (typeof ctx.getEditorState !== 'function') {
    return console.warn('DraftExt: First argument (ctx) must have getEditorState function');
  }
  function createPluginIterator(funcName) {
    return function pluginIterator() {
      const args = [...arguments];
      let res;
      function iterator(obj) {
        if (!res && typeof obj[funcName] === 'function') {
          res = obj[funcName](ctx, ...args);
        }
      }
      subscriber.notify(funcName, ctx, ...args);
      if (plugins.extensions) {
        plugins.extensions.forEach(iterator);
      }
      if (plugins.decorators) {
        plugins.decorators.forEach(iterator);
      }
      if (plugins.blocks) {
        plugins.blocks.forEach(iterator);
      }
      if (!res && typeof ctx[funcName] === 'function') {
        res = ctx[funcName](...args);
      }

      return res;
    };
  }
  const obj = {
    bind: {},
    subscriber,
    getEditorStateWithDecorators: (editorState) => {
      const decorators = plugins.decorators && plugins.decorators.map(d => ({
        strategy: d.strategy,
        component: d,
        props: {
          delegate: ctx,
        },
      }));
      let edt = EditorState.createEmpty(new CompositeDecorator(decorators));
      if (editorState) {
        edt = EditorState.createWithContent(editorState, new CompositeDecorator(decorators));
      }
      return edt;
    },
  };
  standardIterators.forEach((n) => { obj.bind[n] = createPluginIterator(n); });
  obj.bind.blockRenderMap = generateBlockRenderMaps(plugins.blocks || []);
  return obj;
}
