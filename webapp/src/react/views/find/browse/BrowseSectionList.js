import React, { Component, PropTypes } from 'react';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import Loader from 'components/loaders/Loader';
import BrowseSectionItem from './BrowseSectionItem';

import './styles/section-list.scss';

class BrowseSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate, props.depth);
    this.clickedItemCached = setupCachedCallback(this.callDelegate.bind(null, 'clickedItem'));
    // now use events as onClick: this.clickedItemCached(i)
  }
  componentDidMount() {
  }
  renderSectionItems(items) {
    const { selectedId } = this.props;
    if (!items || !items.length) {
      return undefined;
    }
    return items.map((item, i) => (
      <BrowseSectionItem
        key={`item${i}`}
        selected={(item.id === selectedId)}
        onClick={this.clickedItemCached(item.id, i, item)}
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

    const sectionsHTML = sections.map((s, i) => (
      <div className="browse-section" key={i}>
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

const { object, arrayOf, shape, string, bool, number } = PropTypes;

BrowseSectionList.propTypes = {
  delegate: object,
  depth: number,
  loading: bool,
  selectedId: string,
  sections: arrayOf(shape({
    title: string,
    items: arrayOf(shape({
      id: string.isRequired,
      title: string,
      leftIcon: string,
      rightIcon: string,
    })),
  })),
};
