import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';
// import { map, list } from 'react-immutable-proptypes';
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
      <ReactMarkdown source={content} />
    );
  }
}

export default Markdown;

// const { string } = PropTypes;

Markdown.propTypes = {};
