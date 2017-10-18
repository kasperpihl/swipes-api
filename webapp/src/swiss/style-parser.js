const VARREGEX = /#{(.*?)}/gi;
import StylePrinter from './style-printer';

export default class StyleParser {
  constructor(className, styles, mixins) {
    this.styles = styles;
    this.className = className;
    this.mixins = mixins;

    this.keyProps = new Set();
    this.valueProps = new Set();
    this.allProps = new Set();
  }

  // ======================================================
  // Generate the stylesheet to be printed
  // ======================================================
  getPropsInfo() {
    return {
      keyProps: [...this.keyProps],
      valueProps: [...this.valueProps],
      allProps: [...this.allProps],
    };
  }

  getPropValuesForKey(key) {
    return (this.props[key] && Object.keys(this.props[key])) || [];
  }

  getAllKeysFromRoot(rootTarget, styleKey) {
    const orgStyleKey = styleKey;
    // Replace '&' signs with the current root.
    styleKey = orgStyleKey.replace(/&/gi, rootTarget);

    // Check for variables in key.
    const keyVariables = styleKey.match(VARREGEX);
    if(keyVariables && keyVariables.length) {
      if(keyVariables.length > 1) return console.warn('We only support one variable pr key: ', root, orgStyleKey);
      // Turning "#{var}" into "var"
      const actualKey = keyVariables[0].substr(2, keyVariables[0].length - 3);
      this.valueProps.add(actualKey);
      this.allProps.add(actualKey);
      const propValues = this.getPropValuesForKey(actualKey);
      styleKey = propValues.map(prop => styleKey.replace(VARREGEX, prop));
    }

    if(!Array.isArray(styleKey)) {
      styleKey = [ styleKey ];
    }
    return styleKey;
  }

  // ======================================================
  // Apply the styles
  // ======================================================
  addStylesToTarget(index, styleKey, styleValue, target) {
    if(!target) {
      target = this.styleArray;
    }
    if(Array.isArray(target)) {
      const addObject = {
        styleKey,
        styleValue,
      };
      if(typeof index !== 'number') {
        target.push(addObject);
      } else {
        target.splice(index, 0, addObject);
      }
    } else if(typeof target === 'object') {
      if(index) {
        target[index] = styleValue;
      } else {
        target = Object.assign(target, styleValue);
      }
    }

  }

  // ======================================================
  // Run mixin 
  // ======================================================
  getResultForMixin(mixinName, mixinArgs) {
    let result = {};
    const mixin = this.mixins[mixinName];
    if(typeof mixin === 'function') {
      if(!Array.isArray(mixinArgs)) {
        mixinArgs = [mixinArgs];
      }
      result = mixin(...mixinArgs);
      if(typeof result !== 'object') {
        console.warn(`swiss: mixin "${mixinName.slice(1)}" returned ${typeof result}. Expected object`);
        result = {};
      }
    } else {
      console.warn(`swiss: unknown mixin: ${mixinName.slice(1)}`);
    }
    return result;
  }

  traverseStyleObject(styleKey, iterateObject, options) {
    options = options || {};
    const mutatedObject = Object.assign({}, iterateObject);
    

    Object.entries(iterateObject).forEach(([key]) => {
      const val = mutatedObject[key];
      if(key.startsWith('_')) {
        delete mutatedObject[key];
        Object.assign(mutatedObject, this.getResultForMixin(key, val));
        return;
      }

      if(typeof val === 'string' || typeof val === 'number') {
        
      }

      if(typeof val === 'object') {
        if(!options.keepDeep) {
          delete mutatedObject[key];
        }
        if(key.startsWith('@')) {
          if(key.startsWith('@keyframes') ) {
            this.createStyleObject(key, val, { keepDeep: true, target: this.keyframes });
          } else if(key.startsWith('@media')){
            this.createStyleObject(key, val, Object.assign({}, options, { rootTarget: val, }));
          }
        } else {
          const allKeys = this.getAllKeysFromRoot(options.rootStyleKey, key);
          allKeys.forEach((parsedKey) => {
            if(options.keepDeep || options.rootTarget) {
              mutatedObject[parsedKey] = this.traverseStyleObject(parsedKey, val, options);
            } else {
              this.createStyleObject(parsedKey, val, options);
            }
          });
          
          console.log('hi', key, val);
        }
      }
    });
    return mutatedObject;
  }

  createStyleObject(styleKey, styleValue, options) {
    const indexToInsertFrom = this.styleArray.length;
    
    styleValue = this.traverseStyleObject(styleKey, styleValue, options);

    this.addStylesToTarget(indexToInsertFrom, styleKey, styleValue, options && options.target);
  }


  run(props) {
    this.styleArray = [];
    this.keyframes = [];
    this.media = [];

    this.props = props;
    Object.entries(this.styles).forEach(([key, val]) => {
      let root = `.${this.className}`;
      if(key !== 'default') {
        root += `.${this.className}-${key}`;
        this.keyProps.add(key);
        this.allProps.add(key);
      } 
      // this.generateStyle(root, root, val);
      this.createStyleObject(root, val, {
        rootStyleKey: root,
      });
    });
    console.log('=====================');
    console.log(StylePrinter(this.styleArray.concat(this.keyframes)));
    console.log('====================='); 
    return {
      styleArray: this.styleArray.concat(this.keyframes),
      keyProps: this.keyProps,
      valueProps: this.valueProps,
    };
  }
}