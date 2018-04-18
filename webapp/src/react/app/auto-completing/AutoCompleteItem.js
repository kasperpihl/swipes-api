import React, { PureComponent } from 'react';
import { getParentByClass } from 'swipes-core-js/classes/utils';
import { styleElement } from 'react-swiss';
import styles from './AutoCompleting.swiss';

const Item = styleElement('div', styles.Item);

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
      <Item innerRef={(c) => { this.container = c; } } selected={selected}>
        {children}
      </Item>
    );
  }
}

export default AutoCompleteItem

// const { string } = PropTypes;

AutoCompleteItem.propTypes = {};
