export default order => {
  let blockIndentMoreThan = -1;
  return order.filter(o => {
    if (blockIndentMoreThan > -1 && o.get('indent') > blockIndentMoreThan) {
      return false;
    }
    if (blockIndentMoreThan > -1 && o.get('indent') <= blockIndentMoreThan) {
      blockIndentMoreThan = -1;
    }
    if (o.get('hasChildren') && !o.get('expanded')) {
      blockIndentMoreThan = o.get('indent');
    }
    return true;
  });
};
