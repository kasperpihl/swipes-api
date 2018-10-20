import randomstring from 'randomstring';

export default (type = '', number = 8) => (type + randomstring.generate(number)).toUpperCase();
