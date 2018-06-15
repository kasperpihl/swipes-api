import {
  DefaultDraftBlockRenderMap,
  EditorState,
  CompositeDecorator,
  ContentState,
  convertFromRaw,
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
  'onUpArrow',
  'onDownArrow',
  'onEscape',
  'onTab',
  'onFocus',
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

export default function(ctx, plugins = {}) {
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
      if(!res && ctx.props && typeof ctx.props[funcName] === 'function') {
        res = ctx.props[funcName](...args);
      }

      return res;
    };
  }
  const obj = {
    bind: {},
    subscriber,
    createEditorState: (initialValue) => {
      const decorators = plugins.decorators && plugins.decorators.map(d => ({
        strategy: d.strategy,
        component: d,
        props: {
          delegate: ctx,
        },
      }));
      
      let contentState;
      
      if (typeof initialValue === 'string') {
        // is just a string.
        contentState = ContentState.createFromText(initialValue);
      } else if(typeof initialValue === 'object' && typeof initialValue.get === 'function') {
        if(typeof initialValue.getCurrentContent === 'function') {
          // is EditorState object
          contentState = initialValue.getCurrentContent();
        } else if(typeof initialValue.getBlockMap === 'function') {
          // is ContentState object alreay
          contentState = initialValue;
        }
      } else if(typeof initialValue === 'object' && initialValue.blocks) {
        // is raw format used for persistence
        contentState = convertFromRaw(initialValue);
      }
      
      if(contentState) {
        return EditorState.createWithContent(contentState, new CompositeDecorator(decorators));
      }
      return EditorState.createEmpty(new CompositeDecorator(decorators));
    },
  };
  standardIterators.forEach((n) => { obj.bind[n] = createPluginIterator(n); });
  obj.bind.blockRenderMap = generateBlockRenderMaps(plugins.blocks || []);
  return obj;
}
