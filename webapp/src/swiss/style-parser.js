const VARREGEX = /#{(.*?)}/gi;
import StylePrinter from './style-printer';

export default class StyleParser {
  constructor(className, styles, mixins) {
    this.styles = styles;
    this.className = className;
    this.mixins = mixins;
  }

  // ======================================================
  // Generate the stylesheet to be printed
  // ======================================================
  
  getPropValuesForKey(key) {
    return (this.props[key] && Object.keys(this.props[key])) || [];
  }

  // ======================================================
  // Apply the styles
  // ======================================================
  addStylesToTarget(index, styleValue, target) {
    if(!target) {
      target = this.styleArray2;
    }
    console.log('t', target);
    if(Array.isArray(target)) {
      if(!index) {
        target.push(styleValue);
      } else {
        target.splice(index, 0, styleValue);
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

  runStyles(rootTarget, styleKey, styleObject, target) {
    // console.log(rootTarget, styleKey, styleObject, target);
    const orgStyleKey = styleKey;

    // Replace '&' signs with the current root.
    styleKey = [ orgStyleKey.replace(/&/gi, rootTarget) ];

    // Check for variables in key.
    const keyVariables = orgStyleKey.match(VARREGEX);
    if(keyVariables && keyVariables.length) {
      if(keyVariables.length > 1) return console.warn('We only support one variable pr key: ', root, orgTarget);
      // Turning "#{var}" into "var"
      const actualKey = keyVariables[0].substr(2, keyVariables[0].length - 3);
      const propValues = this.getPropValuesForKey(actualKey);
      styleKey = propValues.map(prop => orgStyleKey.replace(VARREGEX, prop));
    }

    let mutatedStyles = Object.assign({}, styleObject);
    const indexToInsertFrom = this.styleArray2.length;
    Object.entries(styleObject).forEach(([key, val]) => {
      if(key.startsWith('_')) {
        mutatedStyles = Object.assign(mutatedStyles, this.getResultForMixin(key, val));
        delete mutatedStyles[key];
      }
      else if(typeof val === 'object') {
        // delete mutatedStyles[key];
        // const actualTarget = target || {};
        // this.runStyles(rootTarget, key, val, actualTarget);
        // mutatedStyles[key] = actualTarget;
        // if(!noRecursive) {
        //   delete mutatedStyles[key];
        //   return this.generateStyle(root, key, val, key.startsWith('@'));
        // }
      }
    });
    console.log(styleKey, mutatedStyles);
    if(!target) {
      styleKey.forEach((sK, i) => this.addStylesToTarget(i + indexToInsertFrom, {
        target: sK,
        value: mutatedStyles
      }))
    } else {
      styleKey.forEach((sK, i) => this.addStylesToTarget(null, mutatedStyles, target));
    }
  }


  generateStyle(root, currentTarget, styles, noRecursive ) {
    const orgTarget = currentTarget;
    currentTarget = currentTarget.replace(/&/gi, root);
    let targets = [ currentTarget ];

    let mutatedStyles = Object.assign({}, styles);
    let currIndex = this.styleArray.length;
    Object.entries(styles).forEach(([key, val]) => {
      if(key.startsWith('_')) {
        mutatedStyles = Object.assign(mutatedStyles, this.getResultForMixin(key, val));
        delete mutatedStyles[key];
      }
      else if(typeof val === 'object') {
        if(!noRecursive) {
          delete mutatedStyles[key];
          return this.generateStyle(root, key, val, key.startsWith('@'));
        }
      }
    });

    const matches = currentTarget.match(VARREGEX);
    if(matches && matches.length) {
      if(matches.length > 1) return console.warn('We only support one variable pr key: ', root, orgTarget);
      const propValues = this.getPropValuesForKey(matches[0].substr(2, matches[0].length - 3));
      targets = propValues.map(prop => currentTarget.replace(VARREGEX, prop));
    }

    if(targets.length && Object.keys(mutatedStyles).length) {
      targets.forEach((target, i) => {
        this.styleArray.splice(currIndex + i, 0, { target, value: mutatedStyles });
      });
    }
  }
  run(props) {
    this.styleArray = [];
    this.styleArray2 = [];
    this.propsWithDynamicValue = [];
    this.propsWithStaticKey = [];
    this.props = props;
    Object.entries(this.styles).forEach(([key, val]) => {
      let root = `.${this.className}`;
      if(key !== 'default') root += `.${this.className}-${key}`;
      this.generateStyle(root, root, val);
      this.runStyles(root, root, val);
    });
    console.log('generated styleArray', this.styleArray2);
    console.log(StylePrinter(this.styleArray2));
    return this.styleArray;
  }
}