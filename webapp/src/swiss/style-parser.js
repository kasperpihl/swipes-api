const VARREGEX = /#{(.*?)}/gi;

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
    return this.styleArray;
  }
}