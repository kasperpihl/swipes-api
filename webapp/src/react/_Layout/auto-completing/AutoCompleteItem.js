import React, { PureComponent } from 'react';
import getParentByClass from 'swipes-core-js/utils/getParentByClass';
import SW from './AutoCompleting.swiss';

class AutoCompleteItem extends PureComponent {
  componentDidMount() {
    this.checkScrollTo();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.checkScrollTo();
    }
  }
  checkScrollTo() {
    const { selected, alignToTop } = this.props;
    if(selected) {
      const el = this.container;
      const scV = getParentByClass(el, 'auto-completing');
      if(el.offsetTop < scV.scrollTop || (el.offsetTop + el.clientHeight) > (scV.scrollTop + scV.clientHeight)) {
        el.scrollIntoView(alignToTop);
      }
    }
  }
  render() {
    const { selected, children } = this.props;

    return (
      <SW.Item innerRef={(c) => { this.container = c; } } selected={selected}>
        {children}
      </SW.Item>
    );
  }
}

export default AutoCompleteItem;