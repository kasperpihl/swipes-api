import {
  DefaultDraftBlockRenderMap,
} from 'draft-js';

const standardIterators = [
  'keyBindingFn',
  'blockRendererFn',
  'handleBeforeInput',
  'handleReturn',
  'handleKeyCommand',
  'onUpArrow',
  'onTab',
  'onDownArrow',
];

const generateBlockRenderMaps = (plugins) => {
  let renderMap = DefaultDraftBlockRenderMap;
  plugins.forEach((p) => {
    if (typeof p.blockRenderMap === 'function') {
      renderMap = renderMap.merge(p.blockRenderMap());
    }
  });
  return renderMap;
};

export default function Setup(plugins, context) {
  if (typeof context !== 'object') {
    return console.warn('DraftExt: Second argument (context) must be an object');
  }
  if (typeof context.setEditorState !== 'function') {
    return console.warn('DraftExt: Context must have setEditorState function');
  }
  if (typeof context.getEditorState !== 'function') {
    return console.warn('DraftExt: Context must have getEditorState function');
  }
  function createPluginIterator(funcName) {
    return function pluginIterator() {
      const args = [...arguments];
      let res;

      plugins.forEach((plugin) => {
        if (!res && typeof plugin[funcName] === 'function') {
          res = plugin[funcName](context, ...args);
        }
      });
      if (!res && typeof context[funcName] === 'function') {
        res = context[funcName](...args);
      }

      return res;
    };
  }
  const obj = {};
  standardIterators.forEach((n) => { obj[n] = createPluginIterator(n); });
  obj.blockRenderMap = generateBlockRenderMaps(plugins);
  return obj;
}
