import React, { Component, PropTypes } from 'react';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import BrowseSectionItem from './BrowseSectionItem';
import Loader from 'components/swipes-ui/Loader';

import './styles/section-list.scss';

class BrowseSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.depth);
    this.clickedItemCached = setupCachedCallback(this.clickedItem, this);
    // now use events as onClick: this.clickedItemCached(i)
  }
  componentDidMount() {
  }
  clickedItem(i, item) {
    this.callDelegate('clickedItem', item);
  }
  renderSectionItems(items) {
    const { selectedItemId } = this.props;
    if (!items || !items.length) {
      return undefined;
    }
    return items.map((item, i) => (
      <BrowseSectionItem
        key={`item${i}`}
        id={item.id}
        selected={(item.id === selectedItemId)}
        onClick={this.clickedItemCached(i, item)}
        title={item.title}
        leftIcon={item.leftIcon}
        rightIcon={item.rightIcon}
      />
    ));
  }
  renderSections() {
    const { sections, loading } = this.props;

    if (loading) {
      return <Loader center />;
    }

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

const { object, arrayOf, shape, string, bool } = PropTypes;

BrowseSectionList.propTypes = {
  delegate: object,
  loading: bool,
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
