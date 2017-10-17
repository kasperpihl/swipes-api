import {
  Dimensions,
  Platform,
} from 'react-native';

const { width: ww, height: wh } = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? 24 : 20;

export const height = wh;
export const width = ww;
export const statusbarHeight = STATUSBAR_HEIGHT;
