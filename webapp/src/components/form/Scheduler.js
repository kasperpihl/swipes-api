import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import moment from 'moment'
import './styles/scheduler.scss'

class Scheduler extends Component {
  constructor(props) {
    super(props)
    let times = List();

    if (props.options && props.options.times) {
      times = List(props.options.times.sort((a,b) => moment(a).unix() - moment(b).unix()));
    }

    let selectedTimes = List();

    if (props.options && props.options.selectedTimes) {
      selectedTimes = List(props.options.selectedTimes);
    }

    this.state = { times, selectedTimes };
    this.selectedTime = this.selectedTime.bind(this);
  }
  mapTimesToColumns() {
    const { times } = this.state;
    let groups = List();

    times.forEach((t, i) => {
      const time = moment(t);
      let currentGroup = groups.last();
      const colTitle = time.format('ddd M/D');

      if (!currentGroup || currentGroup.title !== colTitle) {
        currentGroup = { title: colTitle, times: []};
        groups = groups.push(currentGroup);
      }

      const item = {
        index: i,
        title: time.format('LT')
      }

      currentGroup.times.push(item);
    });

    return groups;
  }
  getValue(){
    const { selectedTimes, times } = this.state;
    return selectedTimes.map((index) => times.get(index)).toJS();
  }
  selectedTime(e){
    const index = parseInt(e.target.getAttribute('data-index'));
    let { selectedTimes } = this.state;

    if (!selectedTimes.includes(index)) {
      selectedTimes = selectedTimes.push(index);
    } else {
      selectedTimes = selectedTimes.filter((t) => index !== t);
    }

    this.setState({selectedTimes});
  }
  renderRows(rows){
    const { times, selectedTimes } = this.state;

    return rows.map((row) => {
      let className = "sw-scheduler__row";

      if (selectedTimes.includes(row.index)) {
        className += " sw-scheduler__row--selected";
      }

      return (
        <div key={"row-" + row.index} data-index={row.index} onClick={this.selectedTime} className={className}>
          {row.title}
        </div>
      )
    })
  }
  renderColumns(){
    const columns = this.mapTimesToColumns();

    return columns.map((col, i) => {
      const { title, times } = col;

      return (
        <div key={'col' + i} className="sw-scheduler__col">
          <div className="sw-scheduler__day">{title}</div>
          {this.renderRows(times)}
        </div>
      )
    })
  }
  render() {
    const style = this.props.style || {};

    return (
      <div className="sw-scheduler" style={style}>
        {this.renderColumns()}
      </div>
    )
  }
}
export default Scheduler

const { shape, object, arrayOf, string, number } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

Scheduler.propTypes = {
  options: shape({
    duration: number,
    times: arrayOf(object),
    selectedTimes: arrayOf(object)
  })
}
