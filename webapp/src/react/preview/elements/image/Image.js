import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';

import './styles/image';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawSize: false,
    };
    this.toggleRawSize = this.toggleRawSize.bind(this);
  }
  toggleRawSize() {
    const { rawSize } = this.state;
    this.setState({ rawSize: !rawSize });
  }
  render() {
    const { data } = this.props;
    const { rawSize } = this.state;
    let className = 'preview-image';

    if (rawSize) {
      className += ' preview-image--full-size';
    }

    return (
      <div className={className} onClick={this.toggleRawSize}>
        <img src={data.get('img')} className="preview-image__image" role="presentation" />
      </div>
    );
  }
}

export default Image;

const { string } = PropTypes;

Image.propTypes = {
  data: mapContains({
    img: string,
  }),
};
