import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindAll, setupCachedCallback, setupLoadingHandlers } from 'classes/utils';
import Button from 'Button';
import Loader from 'components/loaders/Loader';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import * as a from 'actions';
import { attachments } from 'swipes-core-js';
import * as Files from './files';
import * as Rows from './rows';
import './preview.scss';

class HOCPreviewModal extends PureComponent {
  static minWidth() {
    return 750;
  }
  static maxWidth() {
    return 1000;
  }
  static fullscreen() {
    return true;
  }
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    setupLoadingHandlers(this);
    this.fetch(props.loadPreview);
    this.onClickButtonCached = setupCachedCallback(this.onClickButton, this);
    bindAll(this, ['onFileLoaded', 'onFileError', 'onAttach']);
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
    const { buttons } = this.state.preview;
    const { browser, target } = this.props;
    const button = buttons[i];
    if (button.url) {
      browser(target, button.url);
    }
    e.target.blur();
  }
  onFileError() {
    this.setState({
      fileLoading: false,
      fileError: true,
    });
  }
  onFileLoaded() {
    this.setState({ fileLoading: false });
  }
  onAttach() {
    const {
      targetId,
      loadPreview,
      addAttachment,
    } = this.props;
    this.setLoadingState('attach');
    addAttachment(targetId, loadPreview.toJS()).then((res) => {
      if (res && res.ok) {
        this.clearLoadingState('attach', 'Successfully attached');
      } else {
        this.clearLoadingState('attach', '!Something went wrong');
      }
    });
  }
  getDefaultState() {
    return {
      loading: true,
      submitting: false,
      preview: null,
      fileLoading: false,
      fileError: false,
    };
  }
  getComponentForRow(row) {
    const Comp = Rows[row.type];
    if (!Comp) {
      console.warn(`Unsupported row type: ${row.type}`);
      return null;
    }
    return Comp;
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
      console.log('preview', params);
    }
    request(endpoint, params).then((res) => {
      if (this._unmounted) {
        return;
      }
      if (res && res.ok) {
        let fileNotFound = false;
        let fileLoading = false;
        if (res.preview.file) {
          if (!this.getComponentForFile(res.preview.file)) {
            fileNotFound = true;
          } else {
            // Keep loading and let the file component turn off the loading.
            fileLoading = true;
          }
        }
        this.setState({
          loading: false,
          preview: res.preview,
          fileNotFound,
          fileLoading,
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
      <div className="preview-no-preview">
        <div className="preview-no-preview__header">Can’t display preview</div>
        <div className="preview-no-preview__text">
          Unfortunately this file format is not supported yet. You can: <br />
          1. Click “Open in” > “Browser” to see preview in browser <br />
          2. Click “Attach to goal” to attach the file to a goal of your choice <br />
        </div>
      </div>
    );
  }
  renderLoader() {
    const { loading, fileLoading } = this.state;
    if (!loading && !fileLoading) {
      return undefined;
    }
    return (
      <div className="preview-loader">
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </div>
    );
  }
  renderHeader() {
    const { preview } = this.state;
    const { header } = preview || {};
    const { title, subtitle } = header || {};

    return <HOCHeaderTitle title={title} subtitle={subtitle} />;
  }
  renderRow(row) {
    const Comp = this.getComponentForRow(row);
    if (!Comp) {
      return undefined;
    }
    return (
      <Comp
        {...row}
      />
    );
  }
  renderCols(cols) {
    return (
      <div className="preview-content">
        {cols.map(([col, obj]) => (
          <div key={col} className={`preview-content__column preview-content__column--${col}`}>
            {obj.sections.map((s, sI) => (
              <div key={sI} className="preview-content__section">
                <Section
                  title={s.title}
                  progress={s.progress}
                />
                {s.rows.map((r, rI) => (
                  <div key={rI} className="preview-content__row">
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
    const { fileLoading } = this.state;
    let className = 'preview-file';
    if (fileLoading) {
      className += ' preview-file--hidden';
    }

    console.log('file', file);
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
    const { preview } = this.state;
    let { buttons } = preview || {};

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
        <Button
          key="attach"
          text="Attach to Goal"
          primary
          {...this.getLoadingState('attach')}
          onClick={this.onAttach}
          className="preview-footer__btn"
        />
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
  browser: func,
  targetId: string,
  addAttachment: func,
  request: func,
  loadPreview: oneOfType([object, string]),
};
HOCPreviewModal.contextTypes = {
  target: string,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: a.api.request,
  addAttachment: attachments.add,
  browser: a.main.browser,
})(HOCPreviewModal);
