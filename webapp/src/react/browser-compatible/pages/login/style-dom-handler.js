import StyleParser from './style-parser';
import { bindAll } from 'swipes-core-js/classes/utils';

class StyleDomHandler {
  constructor(className, styles) {
    this._className = className;
    this._styles = styles;
    this._listenForProps = [];
    this._props = {};
    this._refCounter = 0;
    bindAll(this, ['subscribe', 'unsubscribe']);
  }
  subscribe(props, oldProps) {
    if(!oldProps) {
      this._incrementRef();
    }
    new StyleParser(this._className, props).run(this._styles);
  }

  unsubscribe(props) {
    this._decrementRef();
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