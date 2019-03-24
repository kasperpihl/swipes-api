import randomstring from 'randomstring';

export default function idGenerate(
  prefix = 8,
  number = undefined,
  upperCase = false
) {
  if (typeof prefix === 'number') {
    upperCase = number || false;
    number = prefix;
    prefix = '';
  }
  const options = {
    length: number
  };
  if (upperCase) {
    console.log('upper lupper');
    options.capitalization = 'uppercase';
  }

  return prefix + randomstring.generate(options);
}
