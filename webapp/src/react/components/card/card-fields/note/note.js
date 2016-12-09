import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';

import './styles/note.scss';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;

    return (
      <div className="card-note">
        {data.get('text')}
      </div>
    );
  }
}

export default Note;

const { string } = PropTypes;

Note.propTypes = {
  data: mapContains({
    text: string,
  }),
};
