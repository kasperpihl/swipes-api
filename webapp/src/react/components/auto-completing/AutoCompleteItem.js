import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { getParentByClass } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
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
    const { item, selected } = this.props;

    let className = 'auto-completing__item';
    if(selected) {
      className += ' auto-completing__item--selected';
    }

    return (
      <div ref="container" className={className} key={item.id}>
        {item.profile.first_name} {item.profile.last_name}
      </div>
    );
  }
}

export default AutoCompleteItem

// const { string } = PropTypes;

AutoCompleteItem.propTypes = {};
