import randomstring from 'randomstring';

export default (prefix = '', number = 8) =>
  prefix + randomstring.generate(number);
