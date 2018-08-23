import React, { PureComponent } from 'react';
import RippleButton from 'RippleButton';
import { colors } from 'utils/globalStyles';
import SW from './ContextButton.swiss';

export default class ContextButton extends PureComponent {
  render() {
    const { context, onNavigateToContext } = this.props;
    const {
      id,
      title,
    } = context;
    const iconMap = {
      M: 'MiniMilestone',
      G: 'MiniGoal',
      N: 'MiniNote',
    };
    const firstLetter = id.charAt(0);

    return (
      <RippleButton onPress={onNavigateToContext}>
        <SW.Wrapper>
          <SW.LeftSide>
            <SW.Icon icon={iconMap[firstLetter]} width={18} height={18} fill={colors.blue} />
          </SW.LeftSide>
          <SW.MiddleSide>
            <SW.LineOfText numberOfLines={1} >
              {title}
            </SW.LineOfText>
          </SW.MiddleSide>
        </SW.Wrapper>
      </RippleButton>
    );
  }
}
