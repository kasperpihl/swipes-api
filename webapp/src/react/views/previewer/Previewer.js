import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import { bindAll, setupCachedCallback, setupLoading } from 'swipes-core-js/classes/utils';
import Button from 'src/react/components/button/Button2';
import Loader from 'components/loaders/Loader';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import Section from 'components/section/Section';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import * as Files from './files';
import * as Rows from './rows';
// import './preview.scss';
import styles from './Previewer.swiss';

const ContentWrapper = styleElement('div', styles.ContentWrapper);
const FileWrapper = styleElement('div', styles.FileWrapper);
const LoaderWrapper = styleElement('div', styles.LoaderWrapper);
const NoPreviewWrapper = styleElement('div', styles.NoPreviewWrapper);
const NoPreviewHeader = styleElement('div', styles.NoPreviewHeader);
const NoPreviewText = styleElement('div', styles.NoPreviewText);
const Footer = styleElement('div', styles.Footer);
const FooterButton = styleElement(Button, styles.FooterButton);

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
    setupLoading(this);
    if(props.preview) {
      this.state.preview = props.preview.toJS();
      this.state.loading = false;
    } else {
      this.fetch(props.loadPreview);
    }

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
    if (button.url && !button.force_external) {
      browser(target, button.url);
    } else if(button.url && button.force_external){
      window.open(button.url);
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
    this.setLoading('attach');
    addAttachment(targetId, loadPreview.toJS()).then((res) => {
      if (res && res.ok) {
        this.clearLoading('attach', 'Successfully attached');
      } else {
        this.clearLoading('attach', '!Something went wrong');
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
      <NoPreviewWrapper>
        <NoPreviewHeader>Can’t display preview</NoPreviewHeader>
        <NoPreviewText>
          Unfortunately this file format is not supported yet. You can: <br />
          1. Click “Open in Browser” to see preview in browser <br />
          2. Click “Download” to save the file to your computer <br />
        </NoPreviewText>
      </NoPreviewWrapper>
    );
  }
  renderLoader() {
    const { loading, fileLoading } = this.state;
    if (!loading && !fileLoading) {
      return undefined;
    }
    return (
      <LoaderWrapper>
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </LoaderWrapper>
    );
  }
  renderHeader() {
    const { title:propTitle } = this.props;
    const { preview } = this.state;
    const { header } = preview || {};
    const { title, subtitle } = header || {};

    const renderedTitle = propTitle || title;
    return (
      <HOCHeaderTitle title={renderedTitle} subtitle={subtitle} />
    );
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

    return (
      <FileWrapper hidden={!!this.state.fileLoading}>
        <Comp
          file={file}
          onLoad={this.onFileLoaded}
          onError={this.onFileError}
          delegate={this}
        />
      </FileWrapper>
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

    if (!buttons || !buttons.length) {
      return undefined;
    }

    return (
      <Footer>
        {buttons.map((b, i) => (
          <FooterButton
            key={i}
            download={b.force_download}
            href={b.force_download ? b.url : undefined}
            title={b.title}
            onClick={b.force_download ? undefined : this.onClickButtonCached(i)}
          />
        ))}
      </Footer>
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

HOCPreviewModal.contextTypes = {
  target: PropTypes.string,
};


export default navWrapper(connect(null, {
  request: ca.api.request,
  addAttachment: ca.attachments.add,
  browser: mainActions.browser,
})(HOCPreviewModal));