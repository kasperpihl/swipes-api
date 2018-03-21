import React, { PureComponent } from 'react';

// import { map, list } from 'react-immutable-proptypes';
import { getParentByClass } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';

// import Icon from 'Icon';

class AutoCompleteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
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
      const el = this.refs.container;
      const scV = getParentByClass(this.refs.container, 'auto-completing');
      if(el.offsetTop < scV.scrollTop || (el.offsetTop + el.clientHeight) > (scV.scrollTop + scV.clientHeight)) {
        this.refs.container.scrollIntoView(alignToTop);
      }
    }
  }
  render() {
    const { item, selected, children } = this.props;

    let className = 'auto-completing__item';
    if(selected) {
      className += ' auto-completing__item--selected';
    }

    return (
      <div ref="container" className={className} key={item.id}>
        {children}
      </div>
    );
  }
}

export default AutoCompleteItem

// const { string } = PropTypes;

AutoCompleteItem.propTypes = {};
