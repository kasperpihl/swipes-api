export default (message) => {
  const regex = /<!(U[A-Z0-9]*)\|/gi;
  const mention_ids = [];
  let tempMatches = [];

  while ((tempMatches = regex.exec(message)) !== null) {
    mention_ids.push(tempMatches[1]);
  }
  return mention_ids;
}
