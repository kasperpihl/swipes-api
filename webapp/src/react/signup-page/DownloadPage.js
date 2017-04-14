import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import './styles/download-page.scss';

class DownloadPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="download-page">
        Download me!
      </div>
    );
  }
}

export default DownloadPage;

// const { string } = PropTypes;

DownloadPage.propTypes = {};
