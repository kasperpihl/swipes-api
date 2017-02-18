import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindAll, setupCachedCallback } from 'classes/utils';
import Button from 'Button';
import Loader from 'components/loaders/Loader';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import * as a from 'actions';
import * as Files from './files';
import './preview.scss';

class HOCPreviewModal extends PureComponent {
  static minWidth() {
    return 750;
  }
  static maxWidth() {
    return 1000;
  }
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.fetch(props.loadPreview);
    this.onClickButtonCached = setupCachedCallback(this.onClickButton, this);
    bindAll(this, ['onClose', 'onFileLoaded', 'onFileError']);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loadPreview !== this.props.loadPreview) {
      this.setState(this.getDefaultState());
      this.fetch(nextProps.loadPreview);
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onClickButton(i, e) {
    const { buttons } = this.props.preview;
    const { browser } = this.props;
    const button = buttons[i];
    if (button.url) {
      browser(button.url);
    }
    e.target.blur();
  }
  onFileError() {
    this.setState({
      loadingFile: false,
      fileError: true,
    });
  }
  onFileLoaded() {
    this.setState({ loadingFile: false });
  }
  getDefaultState() {
    return {
      loading: true,
      preview: null,
      loadingFile: false,
      fileError: false,
    };
  }
  getComponentForRow(row) {

  }
  getComponentForFile(file) {
    const Comp = Object.entries(Files).find(([k, f]) => {
      if (typeof f.supportContentType !== 'function') {
        console.warn(`Preview file ${k} missing static supportContentType`);
        return null;
      }
      return !!f.supportContentType(file.content_type);
    });

    if (!Comp) {
      console.warn(`Unsupported preview file type: ${file.content_type}`);
      return undefined;
    }
    return Comp[1];
  }
  fetch(params) {
    const { request } = this.props;
    let endpoint = 'find.preview';
    if (typeof params === 'string') {
      endpoint = 'links.preview';
      params = { short_url: params };
    } else {
      params = params.toJS();
    }
    request(endpoint, params).then((res) => {
      if (this._unmounted) {
        return;
      }
      if (res && res.ok) {
        let fileNotFound = false;
        let loadingFile = false;
        if (res.preview.file) {
          if (!this.getComponentForFile(res.preview.file)) {
            fileNotFound = true;
          } else {
            // Keep loading and let the file component turn off the loading.
            loadingFile = true;
          }
        }
        this.setState({
          loading: false,
          preview: res.preview,
          fileNotFound,
          loadingFile,
        });
      } else {
        console.warn('Preview error', res);
      }
    });
  }
  renderError() {
    return (
      <div>Some error happened :(</div>
    );
  }
  renderNoPreview() {
    return (
      <div>No preview for this file</div>
    );
  }
  renderLoader() {
    const { loading, loadingFile } = this.state;
    if (!loading && !loadingFile) {
      return undefined;
    }
    return (
      <div className="preview-loader">
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </div>
    );
  }
  renderHeader() {
    // const { title, subtitle } = header;

    return <HOCHeaderTitle title="Fireworks" subtitle="Uploaded on the 4th of July" />;
  }
  renderRow(row, i) {

  }
  renderCols(cols) {
    return (
      <div className="preview-content">
        {cols.map(([col, obj]) => (
          <div key={col} className={`preview__${col}`}>
            {obj.sections.map((s, sI) => (
              <div key={sI} className="preview__section">
                <Section
                  title={s.title}
                  progress={s.progress}
                />
                {s.rows.map((r, rI) => (
                  <div key={rI} className="preview__row">
                    {this.renderRow(r, rI)}
                  </div>
              ))}
              </div>
          ))}
          </div>
        ))}
      </div>
    );
  }
  renderFile(file) {
    const Comp = this.getComponentForFile(file);
    const { loadingFile } = this.state;
    let className = 'preview-file';
    if (loadingFile) {
      className += ' preview-file--hidden';
    }
    return (
      <div className={className}>
        <Comp
          file={file}
          onLoad={this.onFileLoaded}
          onError={this.onFileError}
          delegate={this}
        />
      </div>
    );
  }
  renderContent() {
    const { loading } = this.state;
    if (loading) {
      return undefined;
    }
    const { preview, fileNotFound } = this.state;
    if (preview.file && fileNotFound) {
      return this.renderNoPreview();
    }
    if (preview.file && !fileNotFound) {
      return this.renderFile(preview.file);
    }

    if (preview.main) {
      const cols = [['main', preview.main]];
      if (preview.side) {
        cols.push(['side', preview.side]);
      }
      return this.renderCols(cols);
    }
    return this.renderError();
  }

  renderFooter() {
    const { options } = this.props;
    const { preview } = this.state;
    let { buttons } = preview || {};
    const custButtons = (options && options.buttons) || [];

    if (!buttons) {
      buttons = [];
    }

    return (
      <div className="preview-footer">
        {buttons.map((b, i) => (
          <Button
            key={i}
            className="preview-footer__btn"
            text={b.title}
            onClick={this.onClickButtonCached(i)}
          />
        ))}
        {custButtons.map((b, i) => (
          <Button
            key={`cust-${i}`}
            text={b.title}
            onClick={b.onClick}
            className="preview-footer__btn"
          />
        ))}

      </div>
    );
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
      >
        {this.renderLoader()}
        {this.renderContent()}
      </SWView>
    );
  }
}

const { object, func, oneOfType, string } = PropTypes;

HOCPreviewModal.propTypes = {
  options: object,
  browser: func,
  preview: object,
  request: func,
  loadPreview: oneOfType([object, string]),
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: a.api.request,
  browser: a.main.browser,
})(HOCPreviewModal);
