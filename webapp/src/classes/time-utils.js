import moment from 'moment';

export function getDayWithoutTime(day) {
  let fullStr = day.calendar();
  const timeIndex = fullStr.indexOf(' at ');

  if (timeIndex !== -1) {
    fullStr = fullStr.slice(0, timeIndex);
  }

  return fullStr;
}

export function dayStringForDate(date) {
  let result;
  const now = moment();
  const parsedDate = moment(date);
  const dayDiff = Math.abs(parsedDate.diff(now, 'days'));

  if (dayDiff >= 6 || dayDiff <= -6) {
    if (parsedDate.year() !== now.year()) {
      result = parsedDate.format("MMM Do 'YY");
    } else {
      result = parsedDate.format('MMM Do');
    }
  } else {
    result = getDayWithoutTime(parsedDate);
  }

  return result;
}

export function timeAgo(date) {
  return moment(date).fromNow();
}

export function startOfDayTs(date) {
  return moment(date).startOf('day').unix();
}

export function isAmPm() {
  return true;
}

export function getTimeStr(date) {
  const format = isAmPm() ? 'h:mma' : 'H:mm';

  return moment(date).format(format);
}
