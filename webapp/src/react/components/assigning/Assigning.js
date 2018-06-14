import React, { PureComponent, Fragment } from 'react';
import { SwissProvider } from 'swiss-react';
import { List } from 'immutable';
import Button from 'src/react/components/button/Button';
import AssigneeImage from './AssigneeImage';
import AssigneeTooltip from './AssigneeTooltip';
import SW from './Assigning.swiss';

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
        <SW.Wrapper
          onClick={onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <SW.AbsoluteWrapper>
            {assignees.map((user, i) => (i < maxImages) ? (
              <Fragment key={i}>
                <SW.WhiteBackground index={i} />
                <SW.ImageWrapper isPic={msgGen.users.getPhoto(user)}  index={i}>
                  <AssigneeImage user={user} size={size} blackAndWhite={this.props.blackAndWhite}/>
                </SW.ImageWrapper>
              </Fragment>
            ) : null)}
          </SW.AbsoluteWrapper>

          {!!extraNumber && (
            <SW.ExtraNumber>+{extraNumber}</SW.ExtraNumber>
          )}
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}

export default Assigning;
