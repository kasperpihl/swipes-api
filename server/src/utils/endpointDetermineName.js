export default () => {
  const originalFunc = Error.prepareStackTrace;
  let callerfile;
  let endpointName;
  try {
    const err = new Error();
    let currentfile;
    let prevFile;

    Error.prepareStackTrace = (err, stack) => stack;

    currentfile = err.stack.shift().getFileName(); // endpointDetermineName.js
    prevFile = err.stack.shift().getFileName(); // endpointCreate.js
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName(); // ...project.list.js (the file calling endpointCreate)

      if (prevFile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;
  if (callerfile) {
    const paths = callerfile.split('/');
    const filename = paths[paths.length - 1];
    endpointName = filename.split('.js')[0];
  }
  return endpointName;
};
