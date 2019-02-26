export default function traverseElement(target, iterator) {
  do {
    if (target && !iterator(target)) {
      target = target.parentNode;
    } else {
      target = undefined;
    }
  } while (target);
  return target;
}
