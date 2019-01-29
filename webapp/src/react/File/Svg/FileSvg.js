import React, { Component } from 'react';
import SW from './FileSvg.swiss';

export default class FileSvg extends Component {
  static supportContentType(contentType) {
    return ['image/svg+xml'].indexOf(contentType) !== -1;
  }
  constructor(props) {
    super(props);
    this.state = {};
    fetch(props.file.s3_url, {
      method: 'GET',
      contentType: ''
    })
      .then(res => {
        if (res && res.status === 200) {
          return res.text();
        } else {
          props.onError();
        }
      })
      .then(svg => {
        svg = svg.replace('<script>', '');
        svg = svg.replace('</script>', '');
        console.log(svg); // es-lint-disable-line
        if (!this._unmounted) {
          props.onLoad();
          this.setState({ renderedSVG: svg });
        }
      });
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  renderSVG() {
    const { renderedSVG } = this.state;
    return renderedSVG;
  }
  render() {
    const { file } = this.props;
    const { renderedSVG } = this.state;

    return <SW.Wrapper dangerouslySetInnerHTML={{ __html: renderedSVG }} />;
  }
}
