import React, { Component, PropTypes } from 'react';
import BrowseSectionItem from './BrowseSectionItem';
import { setupDelegate } from 'classes/utils';

import './styles/section-list.scss';

class BrowseSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  componentDidMount() {
  }
  renderSectionItems(items) {
    return items.map(i => <BrowseSectionItem id={i.id} title={i.title} leftIcon={i.leftIcon} rightIcon={i.rightIcon} />);
  }
  renderSections() {
    const { sections } = this.props;

    const sectionsHTML = sections.map(s => (
      <div className="browse-section">
        <div className="browse-section__title">{s.title}</div>
        {this.renderSectionItems(s.items)}
      </div>
      ));

    return sectionsHTML;
  }
  render() {
    return (
      <div className="browse-section-list">
        {this.renderSections()}
      </div>
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
