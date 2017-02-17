import { string, object, array, any, number } from 'valjs';

const icon = object.of({

});
const preview = object.as({
  name: string,
  id: string,
  type: string,
});
const row = any.of([
  object.as({
    type: 'default',
    title: string,
    leftIcon: icon,
    onClick: preview,
  }),
]);
const section = object.as({
  title: string.require(),
  rows: array.of(row).require(),
  progress: number.min(0).max(100),
  progressColor: string,
});
export default object.as({
  header: object.as({
    title: string.require(),
    subtitle: string,
  }).require(),
  main: object.as({
    title: string.require(),
    sections: section.require(),
  }),
  side: object.as({
    title: string.require(),
    sections: section.require(),
  }),
  file: object.as({
    url: string.require(),
    contentType: string.require(),
  }),
});
