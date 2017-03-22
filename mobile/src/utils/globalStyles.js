import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

const { width: ww, height: wh } = Dimensions.get('window');

const VIEW_HEIGHT = Platform.OS === 'android' ? wh - 24 : wh;
const VIEW_WIDTH = ww;

export const viewSize = {
  width: VIEW_WIDTH,
  height: VIEW_HEIGHT
}

export const colors = {
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
  redColor: '#FC461E',
  yellowColor: '#FFD776',
  bgColor: '#fff',
  bgGradientFrom: '#330867',
  bgGradientTo: '#30cfd0',
}