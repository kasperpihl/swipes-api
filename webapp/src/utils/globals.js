import { version } from '../../package.json';

// Detect which browser and what version.
const browserRes = (function(){
  var ua= navigator.userAgent, tem, 
  M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
    tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
    if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
})().split(' ');

const isBrowserSupported = (browser, ver) => {
  browser = browser.toLowerCase();
  ver = parseInt(ver, 10);
  switch(browser){
    case 'chrome': return ver >= 55;
    case 'safari': return ver >= 9;
    case 'firefox': return ver >= 55; 
    default:
      return false;
  }
}

export default function getGlobals() {
  const globals = {
    apiUrl: location.origin,
    browser: browserRes[0],
    browserVersion: browserRes[1],
    isBrowserSupported: isBrowserSupported(browserRes[0], browserRes[1]),
    isDev: (process.env.NODE_ENV !== 'production'),
    isElectron: (window.process && window.process.versions.electron),
    version,
    withoutNotes: false,
    platform: 'web',
    apiHeaders: {
      'sw-web-version': version,
      'sw-platform': 'web',
    }
  };

  if(globals.isElectron) {
    const remote = nodeRequire('electron').remote;
    globals.platform = window.process.platform;
    globals.apiHeaders['sw-platform'] = window.process.platform;
    globals.apiHeaders['sw-electron-arch'] = window.process.arch;
    globals.apiHeaders['sw-electron-version'] = remote.getGlobal('version');
  }
  return globals;
}