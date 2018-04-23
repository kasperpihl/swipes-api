import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import './styles/markdown.scss';

class Markdown extends PureComponent {
  render() {
    const { content, indentLeft } = this.props;
    let className = 'markdown';
    if (indentLeft) {
      className += ' markdown--indent';
    }
    return (
      <ReactMarkdown source={content} className={className} />
    );
  }
}

export default Markdown;