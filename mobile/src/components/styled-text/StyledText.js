import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/globalStyles';

class RippleButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderString() {
    const { text, textStyle } = this.props;

    return (
      <View>
        <Text style={{ includeFontPadding: false }}>
          {text.map((t, i) => {
            if (typeof t === 'string') {
              return <Text key={t.id + '' + (i * 0.5)} style={textStyle}>{t}</Text>;
            }

            return (
              <Text key={t.id + '' + i} style={t.boldStyle}>
                {t.string}
              </Text>
            );
          })}
        </Text>
      </View>
    )
  }
  render() {
    return this.renderString();
  }
}

export default RippleButton;
