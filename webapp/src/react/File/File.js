import React, { PureComponent } from 'react';
import withLoader from 'src/react/_hocs/withLoader';
import Loader from 'src/react/_components/loaders/Loader';
import SWView from 'src/react/_Layout/view-controller/SWView';
import CardHeader from 'src/react/_components/CardHeader/CardHeader';
import Button from 'src/react/_components/Button/Button';
import * as Files from './registerFileTypes';
import SW from './File.swiss';
import request from 'swipes-core-js/utils/request';

@withLoader
export default class File extends PureComponent {
  static minWidth() {
    return 750;
  }
  static maxWidth() {
    return 1000;
  }
  static fullscreen() {
    return true;
  }
  state = {
    file: null
  };
  componentDidMount() {
    this.fetchFile();
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  handleOpenInBrowser = () => {
    const { file } = this.state;
    window.open(file.s3_url);
  };
  handleFileError = () => {
    const { loader } = this.props;
    loader.error('file', 'Something went wrong');
  };
  handleFileLoaded = () => {
    const { loader } = this.props;
    loader.clear('file');
  };
  getComponentForFile(file) {
    let Comp = () => null;
    if (file) {
      Object.entries(Files).find(([k, f]) => {
        if (typeof f.supportContentType !== 'function') {
          console.warn(`Preview file ${k} missing static supportContentType`);
          return null;
        }
        if (!!f.supportContentType(file.content_type)) {
          Comp = f;
          return true;
        }
      });
    }
    return Comp;
  }
  async fetchFile() {
    const { fileId, loader } = this.props;

    const res = await request('file.get', {
      file_id: fileId
    });

    if (this._unmounted) {
      return;
    }

    if (!res.ok) {
      loader.error('fetch', res.error, 3000);
      return;
    }
    if (!this.getComponentForFile(res.file)) {
      loader.error('fetch', 'Unsupported file');
      return;
    }

    loader.set('file');
    loader.clear('fetch');
    this.setState({ file: res.file });
  }
  renderError(error) {
    if (error !== 'Unsupported file') {
      return <div>{error}</div>;
    }
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
  renderHeader() {
    const { file } = this.state;
    if (!file) {
      return;
    }

    return (
      <CardHeader title={file.file_name}>
        <Button
          title="Open in browser"
          onClick={this.handleOpenInBrowser}
        />
        <Button
          download
          title="Download"
          target="_blank"
          href={file.s3_url}
        />
      </CardHeader>
    );
  }

  render() {
    const { loader } = this.props;
    const { file } = this.state;
    let Comp = this.getComponentForFile(file);

    const isLoading = loader.check('fetch') || loader.check('file');
    const error = loader.get('fetch').error || loader.get('file').error;

    return (
      <SWView header={this.renderHeader()}>
        {error && this.renderError(error)}
        {isLoading && (
          <SW.LoaderWrapper>
            <Loader
              center
              text="Loading"
              textStyle={{ color: '#333D59', marginTop: '9px' }}
            />
          </SW.LoaderWrapper>
        )}
        {file && (
          <SW.FileWrapper hidden={loader.check('file')}>
            <Comp
              file={file}
              onLoad={this.handleFileLoaded}
              onError={this.handleFileError}
              delegate={this}
            />
          </SW.FileWrapper>
        )}
      </SWView>
    );
  }
}
