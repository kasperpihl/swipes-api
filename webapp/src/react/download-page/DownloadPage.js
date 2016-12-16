import React, { Component } from 'react';
import Icon from 'Icon';
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

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-win32-ia32.zip" traget="_blank">
            <button>
              <Icon svg="WindowsIcon" />
              Windows 32bit
            </button>
          </a>

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-win32-x64.zip" traget="_blank">
            <button>
              <Icon svg="WindowsIcon" />
              Windows 64bit
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a href="http://cdn.swipesapp.com/appdownloads/SwipesWorkspace.dmg" traget="_blank">
            <button>
              <Icon svg="MacIcon" />
              OS X
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-linux-ia32.zip" traget="_blank">
            <button>
              <Icon svg="LinuxIcon" />
              Linux 32bit
            </button>
          </a>

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-linux-x64.zip" traget="_blank">
            <button>
              <Icon svg="LinuxIcon" />
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
    let downloadOptions; // = this.renderButtons();
    const microCopy = 'But only for a few selected people.';

    return (
      <div className="dl-card">
        {/* <img src={SwipesIcon}/> */}
        <h6>SECRET VERSION OF SWIPES</h6>
        <p>Swipes is available. <br /> {microCopy}</p>
        {downloadOptions}
      </div>
    );
  }
  render() {
    return (
      <div className="dl-page-wrapper">
        {this.renderWebsite()}
      </div>
    );
  }
}

module.exports = DownloadPage;
