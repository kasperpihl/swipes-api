export default function buttonParseTitle(title, status) {
  let renderedTitle = title;
  if (status && status.error) {
    renderedTitle = status.error;
  }
  if (status && status.success) {
    renderedTitle = status.success;
  }
  return renderedTitle;
}
