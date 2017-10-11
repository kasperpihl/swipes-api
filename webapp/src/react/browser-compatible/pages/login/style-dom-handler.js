import StyleParser from './style-parser';
import { bindAll } from 'swipes-core-js/classes/utils';
const VARREGEX = /#{(.*?)}/gi;

export default class StyleDomHandler {
  constructor(className, styles, mixins) {
    this.styles = styles;
    this._variables = {
      dynamic: [],
      all: [],
    };

    this._props = {};

    this._refCounter = 0;
    this.parser = new StyleParser(className, styles, mixins);
    bindAll(this, ['subscribe', 'unsubscribe']);
    this._checkVariables();
    this._domEl = document.createElement('style');
    this._domEl.type = 'text/css';
  }
  getVariables() {
    return this._variables.all;
  }
  subscribe(props, oldProps) {
    if(!oldProps) { // This is when the component mounts, if oldProps, it updates!
      this._incrementRef();
    }
    this._checkPropsAndUpdateDOM(props, oldProps);
  }
  unsubscribe(props) {
    this._checkPropsAndUpdateDOM({}, props);
    this._decrementRef();
  }
  _addProp(key, value) {
    if(typeof this._props[key][value] === 'undefined') {
      this._props[key][value] = 1;
    } else {
      this._props[key][value] = this._props[key][value] + 1;
    }
  }
  _removeProp(key, value) {
    this._props[key][value] = this._props[key][value] - 1;
    if(this._props[key][value] === 0) {
      delete this._props[key][value];
    }
  }
  _checkPropsAndUpdateDOM(props, oldProps) {
    oldProps = oldProps || {};
    let needUpdate = false;
    this._variables.dynamic.forEach((key) => {
      if(!oldProps[key] && props[key]) {
        this._addProp(key, '' + props[key]);
        needUpdate = true;
      }
      if(oldProps[key] && !props[key]) {
        this._removeProp(key);
        needUpdate = true;
      }
      if(props[key] && oldProps[key] && (''+props[key] !== oldProps[key])) {
        this._removeProp(key, ''+props[key]);
        this._addProp(key, oldProps[key]);
        needUpdate = true;
      }
    });
    if(needUpdate) {
      this._updateDomElement();
    }
  }
  _updateDomElement() {
    const newChildEl = document.createTextNode(this.parser.run(this._props));

    if(this._childEl) {
      this._domEl.replaceChild(newChildEl, this._childEl);
    } else {
      this._domEl.appendChild(newChildEl);
    }
    this._childEl = newChildEl;
  }
  _addDomElement() {
    document.head.appendChild(this._domEl);
    this._updateDomElement();
  }
  _removeDomElement() {
    document.head.removeChild(this._domEl);
  }
  _incrementRef() {
    this._refCounter++;
    if(this._refCounter === 1) {
      this._addDomElement();
    }
  }
  _decrementRef() {
    this._refCounter--;
    if(this._refCounter === 0) {
      this._removeDomElement();
    }
  }

  _addVariable(variable, dynamic) {
    if(variable.startsWith('#{')) {
      variable = variable.substr(2, variable.length - 3)
    }
    if(this._variables.all.indexOf(variable) === -1) {
      this._variables.all.push(variable);
    }
    if(dynamic && this._variables.dynamic.indexOf(variable) === -1) {
      this._props[variable] = {};
      this._variables.dynamic.push(variable);
    }
  }
  _checkVariables(styles) {
    const iterateStyles = styles || this.styles;
    Object.entries(iterateStyles).forEach(([key, value]) => {
      if(!styles && key !== 'default') this._addVariable(key);
      else if(styles) {
        const keyMatches = key.match(VARREGEX);
        if(keyMatches && keyMatches.length){
          this._addVariable(keyMatches[0], true);
        }
        
        value = '' + value;
        const valueMatches = value.match(VARREGEX);
        if(valueMatches && valueMatches.length){
          valueMatches.forEach(valMatch => this._addVariable(valMatch, true));
        }
      }

      if(typeof value === 'object') {
        this._checkVariables(value);
      }
    })
  }
}