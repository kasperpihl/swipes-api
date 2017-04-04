import { StyleSheet } from 'react-native';
import { colors, viewSize } from '../../../utils/globalStyles';

export const styles = StyleSheet.create({
  container: {
    height: viewSize.height,
    flexDirection: 'row',
  },
  view: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 99,
  }
})