import React, { PureComponent } from 'react';
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
    const { content } = this.props;
    return (
      <ReactMarkdown source={content} className="markdown" />
    );
  }
}

export default Markdown;

// const { string } = PropTypes;

Markdown.propTypes = {};
