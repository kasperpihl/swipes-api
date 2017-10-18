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
    const styleKeys = [];
    
    const keyVariables = styleKey.match(VARREGEX);
    if(keyVariables && keyVariables.length) {
      keyVariables.forEach(vari => {
        const actualKey = vari.substr(2, vari.length - 3);
        this.valueProps.add(actualKey);
        this.allProps.add(actualKey);
      })
      Object.entries(this.props).forEach(([refNum, props]) => {
        let localStyleKey = styleKey.replace(/&/gi, `.sw-${refNum}${rootTarget}`);
        keyVariables.forEach((propKey) => {
          const actualKey = propKey.substr(2, propKey.length - 3);
          let value = this.props[refNum][actualKey];
          if(this.props[refNum][actualKey]) {
            if(!value.startsWith('.')){
              value = `.${this.className}-${actualKey}-${value}`;
            }
            localStyleKey = localStyleKey.replace(new RegExp(propKey, 'g'), value);
          }
        })
        if(!localStyleKey.match(VARREGEX)) {
          styleKeys.push(localStyleKey);
        }
      })
    } else {
      styleKeys.push(styleKey.replace(/&/gi, rootTarget));
    }

    return styleKeys;
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