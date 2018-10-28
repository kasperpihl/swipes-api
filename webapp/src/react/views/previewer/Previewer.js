import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { setupCachedCallback } from 'react-delegate';
import Loader from 'components/loaders/Loader';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import * as Files from './files';
import SW from './Previewer.swiss';

@navWrapper
@connect(
  null,
  {
    request: ca.api.request,
    addAttachment: ca.attachments.add,
    browser: mainActions.browser,
  }
)
export default class extends PureComponent {
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
    if (props.preview) {
      this.state.preview = props.preview.toJS();
      this.state.loading = false;
    } else {
      this.fetch(props.loadPreview);
    }

    this.onClickButtonCached = setupCachedCallback(this.onClickButton, this);
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
    } else if (button.url && button.force_external) {
      window.open(button.url);
    }
    e.target.blur();
  }
  onFileError = () => {
    this.setState({
      fileLoading: false,
      fileError: true,
    });
  };
  onFileLoaded = () => {
    this.setState({ fileLoading: false });
  };
  getDefaultState() {
    return {
      loading: true,
      submitting: false,
      preview: null,
      fileLoading: false,
      fileError: false,
    };
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
    request(endpoint, params).then(res => {
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
    return <div>Some error happened :(</div>;
  }
  renderNoPreview() {
    return (
      <SW.NoPreviewWrapper>
        <SW.NoPreviewHeader>Can’t display preview</SW.NoPreviewHeader>
        <SW.NoPreviewText>
          Unfortunately this file format is not supported yet. You can: <br />
          1. Click “Open in Browser” to see preview in browser <br />
          2. Click “Download” to save the file to your computer <br />
        </SW.NoPreviewText>
      </SW.NoPreviewWrapper>
    );
  }
  renderLoader() {
    const { loading, fileLoading } = this.state;
    if (!loading && !fileLoading) {
      return undefined;
    }
    return (
      <SW.LoaderWrapper>
        <Loader
          center
          text="Loading"
          textStyle={{ color: '#333D59', marginTop: '9px' }}
        />
      </SW.LoaderWrapper>
    );
  }
  renderHeader() {
    const { title: propTitle } = this.props;
    const { preview } = this.state;
    const { header } = preview || {};
    const { title, subtitle } = header || {};

    const renderedTitle = propTitle || title;
    return <HOCHeaderTitle title={renderedTitle} subtitle={subtitle} />;
  }
  renderFile(file) {
    const Comp = this.getComponentForFile(file);

    return (
      <SW.FileWrapper hidden={!!this.state.fileLoading}>
        <Comp
          file={file}
          onLoad={this.onFileLoaded}
          onError={this.onFileError}
          delegate={this}
        />
      </SW.FileWrapper>
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

    return this.renderError();
  }

  renderFooter() {
    const { preview } = this.state;
    let { buttons } = preview || {};

    if (!buttons || !buttons.length) {
      return undefined;
    }

    return (
      <SW.Footer>
        {buttons.map((b, i) => (
          <SW.FooterButton
            key={i}
            download={b.force_download}
            href={b.force_download ? b.url : undefined}
            title={b.title}
            onClick={b.force_download ? undefined : this.onClickButtonCached(i)}
          />
        ))}
      </SW.Footer>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()} footer={this.renderFooter()}>
        {this.renderLoader()}
        {this.renderContent()}
      </SWView>
    );
  }
}
