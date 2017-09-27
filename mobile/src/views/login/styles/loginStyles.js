import { StyleSheet } from 'react-native';
import { colors, viewSize, statusbarHeight } from '../../../utils/globalStyles';

export const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    height: viewSize.height + statusbarHeight,
    backgroundColor: colors.bg
  },
  input: {
    backgroundColor: colors.bg
  },
  button: {

  },
  buttonLabel: {

  }
})
