const VARREGEX = /#{(.*?)}/gi;

export default class StyleParser {
  constructor(className, styles, mixins) {
    this.styles = styles;
    this.className = className;
    this.mixins = mixins;
  }

  // ======================================================
  // Printing out the stylesheet
  // ======================================================
  printStyleSheet() {
    let styleString = '';
    this.styleArray.forEach(({target, value}) => {
      styleString += `${target} ${this.recursiveParseStyleObject(value, 0)}`;
    })
    return styleString;
  }
  recursiveParseStyleObject(styleObject, depth) {
    let styleString = '{\r\n';
    Object.entries(styleObject).forEach(([styleKey, styleValue]) => {
      const parsedKey = this.parseStyleKey(styleKey);
      let parsedValue;
      let separator = '';
      let ending = '\r\n';
      if(typeof styleValue === 'object') {
        parsedValue = this.recursiveParseStyleObject(styleValue, depth + 1);
      } else {
        separator = ': ';
        ending = ';\r\n';
        parsedValue = this.parseStyleValue(styleKey, styleValue);
      }
      // Properly handle indention.
      for(let i = 0 ; i <= depth ; i++) styleString += '  ';

      styleString += parsedKey + separator + parsedValue + ending;
    })
    for(let i = 0 ; i < depth ; i++) styleString += '  ';
    styleString += '}\r\n';

    return styleString;
  }
  parseStyleKey(styleKey) {
    // Here we add support for camel case.
    return styleKey.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
  }
  parseStyleValue(styleKey, styleValue) {
    // Modify the value
    return styleValue;
  }


  // ======================================================
  // Generate the stylesheet to be printed
  // ======================================================
  
  getPropValuesForKey(key) {
    return (this.props[key] && Object.keys(this.props[key])) || [];
  }

  generateStyle(root, currentTarget, styles, noRecursive ) {
    const orgTarget = currentTarget;
    currentTarget = currentTarget.replace(/&/gi, root);
    let targets = [ currentTarget ];

    let mutatedStyles = Object.assign({}, styles);
    let currIndex = this.styleArray.length;
    Object.entries(styles).forEach(([key, val]) => {
      if(key.startsWith('_')) {
        const mixin = this.mixins[key];
        if(typeof mixin === 'function') {
          if(!Array.isArray(val)) {
            val = [val];
          }
          const result = mixin(...val);
          if(typeof result === 'object') {
            mutatedStyles = Object.assign(mutatedStyles, result);
          }
          
        } else {
          console.warn(`swiss: unknown mixin: ${key.slice(1)}`);
        }
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
    this.props = props;
    Object.entries(this.styles).forEach(([key, val]) => {
      let root = `.${this.className}`;
      if(key !== 'default') root += `.${this.className}-${key}`;
      this.generateStyle(root, root, val);
    });
    return this.printStyleSheet();
  }
}