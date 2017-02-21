import { string, object, array, any, number, bool } from 'valjs';

const icon = object.of({
  src: string,
  icon: string,
  color: string,
  initials: string,
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
  object.as({
    type: 'markdown',
    content: string,
    indentLeft: bool,
  }),
  object.as({
    type: 'tags',
    tags: array,
  }),
  object.as({
    type: 'attachment',
    title: string,
    src: string,
    onClick: preview,
    leftIcon: icon,
  }),
]);

const section = object.as({
  title: string.require(),
  rows: array.of(row).require(),
  progress: number.min(0).max(100),
}).require();

export default object.as({
  header: object.as({
    title: string.require(),
    subtitle: string,
  }).require(),
  main: object.as({
    title: string.require(),
    sections: array.of(section).require(),
  }),
  side: object.as({
    title: string.require(),
    sections: array.of(section).require(),
  }),
  file: object.as({
    url: string.require(),
    contentType: string.require(),
  }),
});
