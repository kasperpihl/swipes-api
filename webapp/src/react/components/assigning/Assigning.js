import React, { PureComponent, Fragment } from 'react';
import { styleElement, SwissProvider } from 'swiss-react';
import { List } from 'immutable';
import Button from 'src/react/components/button/Button';
import AssigneeImage from './AssigneeImage';
import AssigneeTooltip from './AssigneeTooltip';

import styles from './Assigning.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const AbsoluteWrapper = styleElement('div', styles.AbsoluteWrapper);
const WhiteBackground = styleElement('div', styles.WhiteBackground);
const ImageWrapper = styleElement('div', styles.ImageWrapper);
const ExtraNumber = styleElement('div', styles.ExtraNumber);


class Assigning extends PureComponent {
  onMouseEnter = (e) => {
    const { tooltip, tooltipAlign, enableTooltip, assignees } = this.props;
    if(!enableTooltip) {
      return;
    }

    tooltip({
      component: AssigneeTooltip,
      props: {
        assignees,
        size: 24,
      },
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: tooltipAlign || 'right',
      },
    });
  }
  onMouseLeave = () => {
    const { tooltip, enableTooltip } = this.props;
    if(!enableTooltip) {
      return;
    }
    tooltip(null);
  }
  render() {
    const {
      assignees,
      maxImages,
      size,
      onClick,
      buttonProps,
    } = this.props;

    if(!assignees.size) return <Button icon="Person" onClick={onClick} {...buttonProps} />

    const extraNumber = Math.max(assignees.size - maxImages, 0);

    return (
      <SwissProvider size={size} blackAndWhite={this.props.blackAndWhite} images={Math.min(assignees.size, maxImages)}>
        <Wrapper
          onClick={onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <AbsoluteWrapper>
            {assignees.map((user, i) => (i < maxImages) ? (
              <Fragment key={i}>
                <WhiteBackground index={i} />
                <ImageWrapper isPic={msgGen.users.getPhoto(user)}  index={i}>
                  <AssigneeImage user={user} size={size} blackAndWhite={this.props.blackAndWhite}/>
                </ImageWrapper>
              </Fragment>
            ) : null)}
          </AbsoluteWrapper>

          {!!extraNumber && (
            <ExtraNumber>+{extraNumber}</ExtraNumber>
          )}
        </Wrapper>
      </SwissProvider>
    );
  }
}

export default Assigning;
