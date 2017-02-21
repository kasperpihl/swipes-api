import React, { PureComponent, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';
// import { map, list } from 'react-immutable-proptypes';

import './styles/markdown.scss';

class Markdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
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

const { string, bool } = PropTypes;

Markdown.propTypes = {
  content: string,
  indentLeft: bool,
};
