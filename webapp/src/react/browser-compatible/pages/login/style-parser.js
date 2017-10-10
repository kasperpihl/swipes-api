const VARREGEX = /#{(.*?)}/gi;

export default class StyleParser {
  constructor(className, styles) {
    this.styles = styles;
    this.className = className;
    this.styleArray = [];
  }
  

  getPropValuesForKey(key) {
    return (this.props[key] && this.props[key].map((prop) => prop.value)) || [];
  }
  printStyleSheet() {
    let styleString = '';
    this.styleArray.forEach(({target, value}) => {
      styleString += `${target} ${JSON.stringify(value).replace(/\"/g, "").replace(/\,/g, ";")}\r\n`;
    })
    return styleString;
  }
  parseValue(target, value) {
    
  }
  generateStyle(target, styles) {
    target = target.replace(/&/gi, this.className);
    let targets = [ target ];

    const mutatedStyles = Object.assign({}, styles);
    Object.entries(styles).forEach(([key, val]) => {
      // console.log(key, typeof val, val);
      if(typeof val === 'object') {
        delete mutatedStyles[key];
        return this.generateStyle(key, val);
      }
    });

    const matches = target.match(VARREGEX);
    if(matches && matches.length) {
      if(matches.length > 1) return console.warn('We only support one variable pr key');
      const propValues = this.getPropValuesForKey(matches[0]);
      targets = propValues.map(prop => target.replace(VARREGEX, prop));
    }
    console.log('mutated', mutatedStyles);

    if(targets.length && Object.keys(mutatedStyles).length) {
      targets.forEach(target => this.styleArray.push({ target, value: mutatedStyles }));
    }
  }
  run(props) {
    this.props = props;
    Object.entries(this.styles).forEach(([key, val]) => {
      if(key === 'default') {
        this.generateStyle(this.className, val);
      } else {
        this.generateStyle(this.className + '.' + key, val);
      }
    });
    console.log(this.printStyleSheet());
  }
}