import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Loader from 'components/loaders/Loader';
import ProgressCircle from './ProgressComponent';

import './styles/toast.scss';

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderLoader() {
    const { loading, progress, completed } = this.props.data;

    if (loading && !progress && !completed) {
      return (
        <Loader size={20} mini center />
      );
    }

    return undefined;
  }
  renderProgressbar() {
    const { loading, progress, completed } = this.props.data;

    if (progress && !loading && !completed) {
      return (
        <ProgressCircle value={progress / 100} />
      );
    }

    return undefined;
  }
  renderSuccess() {
    if (this.props.data.completed) {
      return <Icon icon="Checkmark" className="toast__icon" />;
    }

    return undefined;
  }
  render() {
    const { title } = this.props.data;

    return (
      <div className="toast">
        <div className="toast__loader">
          {this.renderLoader()}
          {this.renderProgressbar()}
          {this.renderSuccess()}
        </div>
        <div className="toast__title">{title}</div>
      </div>
    );
  }
}

export default Toast;

const { string, number, bool, shape } = PropTypes;

Toast.propTypes = {
  data: shape({
    title: string.isRequired,
    loading: bool,
    progress: number,
    completed: bool,
  }),
};
