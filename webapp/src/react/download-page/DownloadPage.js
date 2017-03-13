import React, { Component } from 'react';
import Icon from 'Icon';
import Gradient from 'components/gradient/Gradient';
import './download-page.scss';

class DownloadPage extends Component {
  componentDidMount() {
    /* if (browser.name === 'safari') {
      const dLink = document.getElementById('safari-download-link');
      dLink.focus();
      dLink.setSelectionRange(0, dLink.value.length);
    }*/
  }
  selectText() {
    const dLink = document.getElementById('safari-download-link');
    dLink.focus();
    dLink.setSelectionRange(0, dLink.value.length);
  }
  renderButtons() {
    return (
      <div className="btn-wrap">

        <div className="btn-group">

          <a rel="noopener noreferrer" href="https://www.dropbox.com/s/cxo9ifcvm2hhgbq/Swipes-win32-ia32.zip?dl=1" target="_blank">
            <button>
              <Icon icon="Windows" />
              Windows 32bit
            </button>
          </a>

          <a rel="noopener noreferrer" href="https://www.dropbox.com/s/mveq4y2lcvinu37/Swipes-win32-x64.zip?dl=1" target="_blank">
            <button>
              <Icon icon="Windows" />
              Windows 64bit
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a rel="noopener noreferrer" href="https://www.dropbox.com/s/3trq2udh5qdwdf9/SwipesInstaller.pkg?dl=1" target="_blank">
            <button>
              <Icon icon="Apple" />
              OS X
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a rel="noopener noreferrer" href="https://www.dropbox.com/s/wbbpqrml7m7ln7s/Swipes-linux-ia32.zip?dl=1" target="_blank">
            <button>
              <Icon icon="Linux" />
              Linux 32bit
            </button>
          </a>

          <a rel="noopener noreferrer" href="https://www.dropbox.com/s/qy3i8y4dxpxbosh/Swipes-linux-x64.zip?dl=1" target="_blank">
            <button>
              <Icon icon="Linux" />
              Linux 64bit
            </button>
          </a>

        </div>

      </div>
    );
  }
  renderLink() {
    return (
      <input ref="downloadLink" id="safari-download-link" type="text" value="http://swipesapp.com/mac" readOnly="true" onClick={this.selectText} />
    );
  }
  renderWebsite() {
    const downloadOptions = this.renderButtons();
    const microCopy = 'Get started by downloading';

    return (
      <div className="dl-card">
        <Icon icon="SwipesLogoText" className="dl-card__svg" />
        <h6>Staging Environment</h6>
        {downloadOptions}
      </div>
    );
  }
  render() {
    return (
      <div className="dl-page-wrapper">
        <Gradient />
        {this.renderWebsite()}
      </div>
    );
  }
}

module.exports = DownloadPage;
