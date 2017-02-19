
export default function Setup(plugins, context, onChange) {
  function createPluginIterator(funcName) {
    return function pluginIterator() {
      const args = [...arguments];
      const editorState = context.pluginsGetEditorState();
      let res;

      plugins.forEach((plugin) => {
        if (!res && typeof plugin[funcName] === 'function') {
          res = plugin[funcName](editorState, onChange, ...args);
        }
      });
      if (!res && typeof context[funcName] === 'function') {
        res = context[funcName](...args);
      }
      return res;
    };
  }
  function createPluginIterators(names) {
    const obj = {};
    names.forEach((n) => { obj[n] = createPluginIterator(n); });
    return obj;
  }
  return createPluginIterators([
    'keyBindingFn',
    'handleBeforeInput',
    'handleReturn',
    'handleKeyCommand',
    'onUpArrow',
    'onTab',
    'onDownArrow',
  ]);
}
