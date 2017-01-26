import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';

class BrowseSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  componentDidMount() {
  }
  renderList() {

  }
  renderSections() {
    const { sections } = this.props;
  }
  render() {
    return (
      <div className="className" />
    );
  }
}

export default BrowseSectionList;

const { object, arrayOf, shape, string } = PropTypes;

BrowseSectionList.propTypes = {
  delegate: object,
  selectedItemId: string,
  sections: arrayOf(shape({
    title: string,
    items: arrayOf(shape({
      id: string,
      title: string,
      leftIcon: string,
      rightIcon: string,
    })),
  })),
};
