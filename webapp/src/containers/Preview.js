import React, { Component, PropTypes } from 'react';
const components = {};
import SwipesCardList from '../components/swipes-card/SwipesCardList';
import SwipesCard from '../components/swipes-card/SwipesCard';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  componentForType(type) {
    switch (type) {
      case 'Card':
        return SwipesCard;
      case 'CardList':
        return SwipesCardList;
    }
  }
  renderPreviewData() {
    const { items } = this.props;

    return items.map((item, i) => {
      const {
        type,
        ...rest
      } = item;
      console.log(...rest);
      const Comp = this.componentForType(type);
      if (Comp) {
        return <Comp {...rest} key={`preview-${i}`} />;
      }
      return null;
    });
  }
  render() {
    return (
      <div className="swipes-service-preview">
        {this.renderPreviewData()}
      </div>
    );
  }
}
export default Preview;

Preview.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.object,
  })).isRequired,
};
