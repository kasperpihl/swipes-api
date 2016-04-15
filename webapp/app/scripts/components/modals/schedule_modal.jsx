var React = require('react');
var DayPicker = require('react-day-picker').default;
var DateUtils = require('react-day-picker').DateUtils;
var ReactSlider = require('react-slider');
var moment = require('moment');

var ScheduleModal = React.createClass({
  getInitialState: function() {
    return {
      selectedDay: null,
      sliderValue: '360',
      timeFromSlider: '06:00',
      timeOfDay: 'PM',
      glow: 'inactive',
      completeTime: null
    }
  },
  scheduleTime: function() {
    var curDate;
    var day;

    if (this.state.selectedDay == null) {
      curDate = moment().format('MMMM Do YYYY');
      day = moment().format('dddd');
    } else {
      var newDate = moment(this.state.selectedDay).format('MMMM Do YYYY');
      curDate = newDate.toString();
    }

    var addedTime = this.state.timeFromSlider + this.state.timeOfDay;
    var parseTime = moment(addedTime, ['HH:mma']).format('hh:mma');

    var timeToParse = curDate + ' ' + parseTime;

    var timeToPass = moment(timeToParse, ['MMMM Do YYYY hh:mma']).format();

    var dataToReturn = timeToPass;
    this.props.data.callback(dataToReturn);
  },
  handleDayClick(e, day, modifiers) {
    if (modifiers.indexOf('disabled') > -1) {
      return;
    }
    this.setState({
      selectedDay: day
    });
  },
  isInteger: function(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    return value % 1 == 0;
  },
  parseTime: function(value) {
    var getTime = value / 60;
    var timeInteger = this.isInteger(getTime);
    var timeToString = getTime.toString();
    var hours;
    var minutes;

    if (!timeInteger) {
      var splitTime = timeToString.split('.');
      hours = splitTime[0];
      minutes = splitTime[1]

      if (minutes.length == 1) {
        minutes = minutes + '0';
      }

      if (minutes >= 0 && minutes <= 24) {
        minutes = '00';
      } else if (minutes >= 25 && minutes <= 49) {
        minutes = '15';
      } else if (minutes >= 50 && minutes <= 74) {
        minutes = '30';
      } else if (minutes >= 75 && minutes <= 100) {
        minutes = '45';
      }

    } else {
      hours = timeToString;
      minutes = '00';
    }

    if (hours.length <= 1) {
      hours = '0' + hours
    }

    var fullTime = hours + ':' + minutes;

    return fullTime
  },
  sliderValue: function() {
    var slider = this.refs.slider;

    var sliderVal = slider.getValue();
    this.setState({sliderValue: sliderVal})

    var fullTime = this.parseTime(sliderVal);

    var parseTime = moment(fullTime, ['HH:mm']).format('hh:mm');

    this.setState({timeFromSlider: parseTime});

  },
  renderSelectedTime: function() {

    var curDate;
    var day;

    if (this.state.selectedDay == null) {
      curDate = moment().format('MMMM Do YYYY');
      day = moment().format('dddd');
    } else {
      var newDate = moment(this.state.selectedDay).format('MMMM Do YYYY');
      day = moment(this.state.selectedDay).format('dddd');
      curDate = newDate
    }

    var addedTime = this.state.timeFromSlider + this.state.timeOfDay;
    var parseTime = moment(addedTime, ['HH:mma']).format('hh:mma');

    var timeToParse = {curDate} + ' ' + {parseTime};

    var timeToPass = moment(timeToParse, ['MMMM Do YYYY hh:mma']).format();

    return (
      <div className='time'>
        This task will be scheduled for <br/>
      <span className="exact-time">{day} {parseTime} - {curDate} </span>
      </div>
    )
  },
  changeTime: function() {

    if (this.state.timeOfDay === 'PM') {
      this.setState({timeOfDay: 'AM'});
    } else {
      this.setState({timeOfDay: 'PM'});
    }
  },
  glowTimeDisplay: function() {
    if (this.state.glow == 'inactive') {
      this.setState({glow: 'active'})
    } else {
      this.setState({glow: 'inactive'})
    }
  },
  renderTimeDisplay: function() {
    var sliderVal = this.state.sliderValue;

    var fullTime = this.parseTime(sliderVal);

    var parseTime = moment(fullTime, ['HH:mm']).format('hh:mm');

    return (
      <div className={"time-display " + this.state.glow}>
        <div className="time-numbers">{parseTime}</div> <div className="time-of-day" onClick={this.changeTime} onMouseDown={this.glowTimeDisplay} onMouseUp={this.glowTimeDisplay}>{this.state.timeOfDay}</div>
      </div>
    )
  },
  renderScheduleBtn: function () {

    return (
      <div className="schedule-button" onClick={this.scheduleTime}>SCHEDULE</div>
    )
  },
  render: function() {
    var that = this;
    var modifiers = {
      disabled: DateUtils.isPastDay,
      selected: (function (day) {
        return DateUtils.isSameDay(that.state.selectedDay, day);
      })
    };

    return (
      <div className="schedule-wrapper">
        <DayPicker onDayClick={this.handleDayClick} modifiers={modifiers} enableOutsideDays={true}/>

        {this.renderTimeDisplay()}

        <ReactSlider className="react-slider" ref='slider' defaultValue={[360]} min={0} max={705} step={15} onChange={this.sliderValue}>
          <div className='react-slider-handle' onMouseDown={this.glowTimeDisplay} onMouseUp={this.glowTimeDisplay}></div>
        </ReactSlider>

        {this.renderSelectedTime()}

        {this.renderScheduleBtn()}
      </div>
    )
  }
})

module.exports = ScheduleModal;
