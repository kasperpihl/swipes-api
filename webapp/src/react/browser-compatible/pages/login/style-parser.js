const VARREGEX = /#{(.*?)}/gi;

export default class StyleParser {
  constructor(className, styles) {
    this.styles = styles;
    this.className = className;
  }

  getPropValuesForKey(key) {
    return (this.props[key] && Object.keys(this.props[key])) || [];
  }
  printStyleSheet() {
    let styleString = '';
    this.styleArray.forEach(({target, value}) => {
      styleString += `${target} {\r\n`;
        Object.entries(value).forEach(([styleProp, styleValue]) => {
          styleString += `  ${styleProp}: ${styleValue};\r\n`;
        })
      styleString += '}\r\n';
    })
    return styleString;
  }
  parseValue(target, value) {
    
  }
  generateStyle(root, currentTarget, styles) {
    const orgTarget = currentTarget;
    currentTarget = currentTarget.replace(/&/gi, root);
    let targets = [ currentTarget ];

    const mutatedStyles = Object.assign({}, styles);
    let currIndex = this.styleArray.length;
    Object.entries(styles).forEach(([key, val]) => {
      if(typeof val === 'object') {
        delete mutatedStyles[key];
        return this.generateStyle(root, key, val);
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
      const root = `.${this.className}.${this.className}-${key}`;
      this.generateStyle(root, root, val);
    });
    return this.printStyleSheet();
  }
}