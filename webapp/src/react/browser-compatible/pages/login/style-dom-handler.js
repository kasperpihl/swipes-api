import StyleParser from './style-parser';
import { bindAll } from 'swipes-core-js/classes/utils';
const VARREGEX = /#{(.*?)}/gi;

export default class StyleDomHandler {
  constructor(className, styles) {
    this.styles = styles;
    this.variables = {
      dynamic: [],
      all: [],
    };

    this._props = {};

    this._refCounter = 0;
    this.parser = new StyleParser(className, styles);
    bindAll(this, ['subscribe', 'unsubscribe']);
    this.checkVariables();
  }
  addVariable(variable, dynamic) {
    if(variable.startsWith('#{')) {
      variable = variable.substr(2, variable.length - 3)
    }
    if(this.variables.all.indexOf(variable) === -1) {
      this.variables.all.push(variable);
    }
    if(dynamic && this.variables.dynamic.indexOf(variable) === -1) {
      this.variables.dynamic.push(variable);
    }
  }
  checkVariables(styles) {
    const iterateStyles = styles || this.styles;
    Object.entries(iterateStyles).forEach(([key, value]) => {
      if(!styles && key !== 'default') this.addVariable(key);
      else if(styles) {
        const keyMatches = key.match(VARREGEX);
        if(keyMatches && keyMatches.length){
          this.addVariable(keyMatches[0], true);
        }
        
        value = '' + value;
        const valueMatches = value.match(VARREGEX);
        if(valueMatches && valueMatches.length){
          valueMatches.forEach(valMatch => this.addVariable(valMatch, true));
        }
      }

      if(typeof value === 'object') {
        this.checkVariables(value);
      }
    })
  }
  subscribe(props, oldProps) {
    if(!oldProps) { // This is when the component mounts, if oldProps, it updates!
      this._incrementRef();
    }
    this.parser.run(props);
  }

  unsubscribe(props) {
    this._decrementRef();
  }
  _fillListenersAndFilters() {

  }
  _incrementRef() {
    this._refCounter++;
  }
  _decrementRef() {
    this._refCounter--;
  }
  _checkForPropListeners(styles) {
    const newStyles = document.createElement('style');
    newStyles.type = 'text/css';
    newStyles.appendChild(document.createTextNode(styleObj))
    document.head.appendChild(newStyles);
    document.head.removeChild(newStyles);
  }
}