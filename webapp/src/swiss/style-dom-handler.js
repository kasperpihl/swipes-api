import StyleParser from './style-parser';
import { bindAll } from 'swipes-core-js/classes/utils';
import print from './style-printer';
const VARREGEX = /#{(.*?)}/gi;

export default class StyleDomHandler {
  constructor(className, styles, mixins) {
    this.styles = styles;

    this._props = {};

    this._refCounter = 0;
    this.parser = new StyleParser(className, styles, mixins);
    bindAll(this, ['subscribe', 'unsubscribe', '_updateDomElement']);
    this._domEl = document.createElement('style');
    this._domEl.type = 'text/css';
  }
  getVariables() {
    return this.parser.getPropsInfo();
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
    if(typeof this._props[key] === 'undefined') {
      this._props[key] = {};
    }
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

    this.getVariables().allProps.forEach((key) => {
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
      window.cancelAnimationFrame(this._updateFrame);
      this._updateFrame = window.requestAnimationFrame(this._updateDomElement);
    }
  }
  _updateDomElement() {
    const { styleArray } = this.parser.run(this._props);

    const printedCss = print(styleArray);
    const newChildEl = document.createTextNode(printedCss);

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
}