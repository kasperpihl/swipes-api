import moment from 'moment';

export function getDayWithoutTime(day) {
  let fullStr = day.calendar();
  const timeIndex = fullStr.indexOf(' at ');

  if (timeIndex !== -1) {
    fullStr = fullStr.slice(0, timeIndex);
  }

  return fullStr;
}

export function getDaysAgo(date) {
  const now = moment();
  const oldDate = moment(date);
  const diff = now.diff(oldDate, 'days');
  if (!diff) {
    return 'today';
  }
  return `${diff} day${diff > 1 ? 's' : ''} ago`;
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

export function timeAgo(date, simple) {
  let agoString = moment(date).fromNow();

  if (simple) {
    agoString = agoString.replace('a few seconds ago', 'Just now');
    agoString = agoString.replace('a minute', '1min')
      .replace(' minutes', 'min')
      .replace('an hour', '1h')
      .replace(' hours', 'h')
      .replace('a day', '1d')
      .replace(' days', 'd')
      .replace('a month', '1month')
      .replace(' months', 'months')
      .replace('a year', '1y')
      .replace(' years', 'y');
  }
  return agoString;
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
