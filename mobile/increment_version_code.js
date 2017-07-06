const jsonfile = require('jsonfile');
const packageJsonFile = require('./package.json');

packageJsonFile.androidVersionCode += 1;

jsonfile.writeFileSync('./package.json', packageJsonFile, { spaces: 2 });
