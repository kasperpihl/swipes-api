// Shorten a string to less than maxLen characters without truncating words.
export default (str, maxLen, withoutNL = true, separator = ' ') => {
  if (str.length <= maxLen) return str;

  let outputString = str.trim();

  if (withoutNL) {
    outputString = outputString.replace(/(\r\n\t|\n|\r\t)/gm, '');
  }
  return outputString.substr(0, str.lastIndexOf(separator, maxLen));
};
