import google from 'googleapis';

const mapApiMethod = (method) => {
  const client = google.gmail('v1');
  const arr = method.split('.');
  const len = arr.length;
  let finalMethod = client;
  let prevMethod = finalMethod;

  for (let i = 0; i < len; i += 1) {
    if (!finalMethod[arr[i]]) {
      return null;
    }

    if (!finalMethod[arr[i]].bind) {
      finalMethod = finalMethod[arr[i]];
    } else {
      finalMethod = finalMethod[arr[i]].bind(prevMethod);
    }

    prevMethod = finalMethod;
  }

  return finalMethod;
};

export default mapApiMethod;
