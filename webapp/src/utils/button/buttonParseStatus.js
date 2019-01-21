export default function buttonParseStatus(status) {
  if (!status) {
    return 'Standard';
  }
  if (status.loading) {
    return 'Loading';
  }
  if (status.error) {
    return 'Error';
  }
  if (status.success) {
    return 'Success';
  }
  return 'Standard';
}
