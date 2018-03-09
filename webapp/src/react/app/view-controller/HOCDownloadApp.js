import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Icon from 'Icon';
import { Link } from 'react-router-dom';
import './styles/download-app.scss'

class HOCDownloadApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showToolbar: true,
    };
    // setupLoading(this);

    this.closeToolbar = this.closeToolbar.bind(this);
  }
  closeToolbar() {
    const { showToolbar } = this.state;

    if (showToolbar) {
      this.setState({ showToolbar: false })
    }
  }
  render() {
    const { showToolbar } = this.state;
    const { isElectron } = this.props;

    if (isElectron || !showToolbar) return null;

    return (
      <div className="download-app">
        For the best experience we recommend you to <Link to="/download" className="download-app__link"> download a desktop app</Link>
        <div className="download-app__close-btn" onClick={this.closeToolbar}>
          <Icon icon="Close" className="download-app__svg" />
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  isElectron: state.getIn(['globals', 'isElectron'])
}, {})(HOCDownloadApp);
