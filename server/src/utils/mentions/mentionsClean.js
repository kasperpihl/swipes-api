export default (message) => {
  const regex = /<![A-Z0-9]*\|(.*?)>/gi;
  return message.replace(regex, (l1, l2, l3) => {
    console.log(l1, l2, l3);
    return l2;
  })
}