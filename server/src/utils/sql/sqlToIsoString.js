export default function sqlToIsoString(property) {
  return `to_char(${property}::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;
}
