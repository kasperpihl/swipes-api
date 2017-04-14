import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
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
        <h1 className="title">Download the Swipes Workspace</h1>
        <h3 className="subtitle">Start working with your team from anywhere</h3>
        <div className="section">
          <div className="section-title">Desktop</div>
          <div className="device-wrapper">
            <div className="device">
              <Icon icon="WindowsDevice" className="device-svg" />
              <p>Windows (64-bit)</p>
            </div>
            <div className="device">
              <Icon icon="MacDevice" className="device-svg" />
              <p>MacOS</p>
            </div>
            <div className="device">
              <Icon icon="LinuxDevice" className="device-svg" />
              <p>Linux (64-bit)</p>
            </div>
          </div>
        </div>

        <div className="section section--coming-soon">
          <div className="section-title">Mobile (Coming Soon)</div>

          <div className="device-wrapper">
            <div className="device">
              <Icon icon="AndroidDevice" className="device-svg" />
              <p>Android</p>
            </div>
            <div className="device">
              <Icon icon="IphoneDevice" className="device-svg" />
              <p>iOS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DownloadPage;

// const { string } = PropTypes;

DownloadPage.propTypes = {};
