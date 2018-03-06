import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import Loader from 'components/loaders/Loader';
import Button from 'Button';
import BrowseSectionItem from './BrowseSectionItem';

import './styles/section-list.scss';

class BrowseSectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'clickedItem', 'onContextClick').setGlobals(props.depth);
    // now use events as onClick: this.clickedItemCached(i)
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
    const threeDots = (
      <Button
        small
        frameless
        icon="ThreeDots"
        className="browse-section__button"
        onClick={this.onContextClick}
      />
    );

    const sectionsHTML = sections.map((s, i) => (
      <div className="browse-section" key={i}>
        <div className="browse-section__header">
          <div className="browse-section__title">{s.title}</div>
          {/* {i === 0 ? threeDots : undefined} */}
        </div>
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
