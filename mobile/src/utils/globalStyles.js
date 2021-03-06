import {
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? 24 : 20;

export const viewSize = {
  width,
  height,
};

export const statusbarHeight = STATUSBAR_HEIGHT;

export const colors = {
  deepBlue4: '#F7F7F8',
  deepBlue5: '#f2f3f4',
  deepBlue10: '#e5e6ea',
  deepBlue20: '#CCCED5',
  deepBlue30: '#B0B4BE',
  deepBlue40: '#999EAC',
  deepBlue50: '#7F8596',
  deepBlue60: '#666D82',
  deepBlue70: '#4C546D',
  deepBlue80: '#333D59',
  deepBlue90: '#192445',
  deepBlue100: '#000C2F',
  deepBlue120: '#000923',
  blue5: '#F0F7FF',
  blue10: '#E6F1FF',
  blue20: '#CCE4FF',
  blue30: '#B0D5FD',
  blue40: '#99C9FF',
  blue60: '#66AFFF',
  blue80: '#3394FF',
  blue100: '#007AFF',
  blue120: '#0063D5',
  blue140: '#004EAC',
  blue160: '#003782',
  red5: '#FEF5F5',
  red10: '#FEEDED',
  red20: '#FEDADA',
  red40: '#FEB6B5',
  red60: '#FD9291',
  red80: '#FD6E6C',
  red100: '#FD4A48',
  red120: '#CA3D42',
  red140: '#97313E',
  red160: '#652438',
  greenColor: '#3ADA8B',
  tishoGreen: '#78F4B0',
  green: '#1DD465',
  greenWithOpacity: opacity => `rgba(29, 212, 101, ${opacity})`,
  redColor: '#FC461E',
  yellowColor: '#FFD776',
  bgColor: '#ffffff',
  bgGradientFrom: '#74C7F5',
  bgGradientTo: '#4973C9',


  // sometimes I can't easily use swiss so I still need this for now
  // I don't think the problem is in swiss tho ;)
  sw1: '#1A2844',
  sw2: '#808591',
  sw3: '#E9EBF0',
  sw4: '#F5F7FC',
  sw5: 'white',

  blue: '#0070E0',
  blue5: '#F0F7FF',
  blue20: '#CCE4FF',
  blue60: '#66AFFF',
  blue80: '#3394FF',

  red: '#FD6150',
  green: '#1DD465',
  yellow: '#FFB038',
};
