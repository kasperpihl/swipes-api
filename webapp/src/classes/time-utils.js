import moment from 'moment'
export function dayStringForDate(date) {
  let result;
  const now = moment();
  const parsedDate = moment(date);
  const dayDiff = Math.abs(parsedDate.diff(now, "days"));
  if (dayDiff >= 6 || dayDiff <= -6) {
    if (parsedDate.year() !== now.year()) {
      result = parsedDate.format("MMM Do 'YY");
    } else {
      result = parsedDate.format("MMM Do");
    }
    return result;
  } else {
    return getDayWithoutTime(parsedDate);
  }
}
export function getDayWithoutTime(day) {
  const fullStr = day.calendar();
  const timeIndex = fullStr.indexOf(" at ");
  if (timeIndex !== -1) {
    return fullStr.slice(0, timeIndex);
  } else {
    return fullStr;
  }
}
export function startOfDayTs(date){
  return moment(date).startOf('day').unix();
}
export function isAmPm(){
  return true;
}
export function getTimeStr(date){
  const format = isAmPm() ? "h:mma" : "H:mm";
  return moment(date).format(format);
}