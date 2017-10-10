export default class StyleParser {
  constructor(className, props) {
    this.props = props;
    this.className = className;
    this.styleArray = [];
  }
  getValuesForKey(key) {
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
  generateStyle(target, value) {
    console.log(target, value);
  }
  run(styles) {
    Object.entries(styles).forEach(([key, val]) => {
      if(key === 'default') {
        this.generateStyle(this.className, val);
      } else {
        this.generateStyle(this.className + '.' + key, val);
      }
    });
  }
}