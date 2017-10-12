// ======================================================
// Printing out the stylesheet
// ======================================================
const parseStyleKey = (styleKey) => {
  // Here we add support for camel case.
  return styleKey.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
}
const parseStyleValue = (styleKey, styleValue) => {
  // Modify the value
  return styleValue;
}

const recursiveParseStyleObject = (styleObject, depth) => {
  let styleString = '{\r\n';
  Object.entries(styleObject).forEach(([styleKey, styleValue]) => {
    const parsedKey = parseStyleKey(styleKey);
    let parsedValue;
    let separator = '';
    let ending = '\r\n';
    if(typeof styleValue === 'object') {
      parsedValue = recursiveParseStyleObject(styleValue, depth + 1);
    } else {
      separator = ': ';
      ending = ';\r\n';
      parsedValue = parseStyleValue(styleKey, styleValue);
    }
    // Properly handle indention.
    for(let i = 0 ; i <= depth ; i++) styleString += '  ';

    styleString += parsedKey + separator + parsedValue + ending;
  })
  for(let i = 0 ; i < depth ; i++) styleString += '  ';
  styleString += '}\r\n';

  return styleString;
}


export default function print(styleArray) {
  let styleString = '';
  styleArray.forEach(({target, value}) => {
    styleString += `${target} ${recursiveParseStyleObject(value, 0)}`;
  })
  return styleString;
}  