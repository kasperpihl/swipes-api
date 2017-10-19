import StyleParser from './style-parser';
import { bindAll } from 'swipes-core-js/classes/utils';
import print from './style-printer';
const VARREGEX = /#{(.*?)}/gi;

export default class StyleDomHandler {
  constructor(className, styles, mixins) {
    this.styles = styles;
    this._props = {};
    this._refCounter = 0;
    this._totalCounter = 0;
    this.parser = new StyleParser(className, styles, mixins);
    bindAll(this, ['subscribe', 'unsubscribe', '_updateDomElement']);
    this._domEl = document.createElement('style');
    this._domEl.type = 'text/css';
  }
  getVariables() {
    return this.parser.getPropsInfo();
  }
  subscribe(props) {
    this._incrementRef();
    const refNum = ++this._totalCounter;
    this._props[refNum] = {};
    this._checkPropsAndUpdateDOM(refNum, props);
    return refNum;
  }
  update(id, props, oldProps) {
    this._checkPropsAndUpdateDOM(refNum, props, oldProps);
  }
  unsubscribe(id) {
    delete this._props[id];
    this._decrementRef();
  }
  _checkPropsAndUpdateDOM(refNum, props, oldProps) {
    oldProps = oldProps || {};
    let needUpdate = false;

    this.getVariables().allProps.forEach((key) => {
      if((!oldProps[key] && props[key]) ||
        (props[key] && oldProps[key] && (''+props[key] !== oldProps[key]))) {
        this._props[refNum][key] = '' + props[key];
        needUpdate = true;
      }
      if(oldProps[key] && !props[key]) {
        delete this._props[refNum][key];
        needUpdate = true;
      }
    });
    console.log('propp', this._props);
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