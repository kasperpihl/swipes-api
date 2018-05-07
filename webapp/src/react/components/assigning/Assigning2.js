import React, { PureComponent, Fragment } from 'react';
import { styleElement, SwissProvider } from 'react-swiss';
import { List } from 'immutable';
import Button from 'src/react/components/button/Button2';
import styles from './Assigning.swiss';
const Wrapper = styleElement('div', styles.Wrapper);
const AbsoluteWrapper = styleElement('div', styles.AbsoluteWrapper);
const WhiteBackground = styleElement('div', styles.WhiteBackground);
const ImageWrapper = styleElement('div', styles.ImageWrapper);
const Image = styleElement('img', styles.Image);
const Initials = styleElement('div', styles.Initials);
const ExtraNumber = styleElement('div', styles.ExtraNumber);
const TooltipWrapper = styleElement('div', styles.TooltipWrapper);
const TooltipItem = styleElement('div', styles.TooltipItem);
const TooltipName = styleElement('div', styles.TooltipName);
const TooltipImage = styleElement('div', styles.TooltipImage);

class Assigning extends PureComponent {
  onMouseEnter = (e) => {
    const { tooltip, tooltipAlign, enableTooltip } = this.props;
    if(enableTooltip) {
      return;
    }

    tooltip({
      component: this.renderTooltip,
      options: {
        boundingRect: e.target.getBoundingClientRect(),
        position: tooltipAlign || 'right',
      },
    });
  }
  onMouseLeave = () => {
    const { tooltip } = this.props;

    tooltip(null);
  }
  renderTooltip = () => {
    const { assignees } = this.props;
    return (
      <TooltipWrapper>
        {assignees.map((user, i) => (
          <TooltipItem key={i}>
            <TooltipImage>{this.renderImage(user)}</TooltipImage>
            <TooltipName>{msgGen.users.getFullName(user)}</TooltipName>
          </TooltipItem> 
        ))}
      </TooltipWrapper>
    );
  }
  renderImage(user) {
    const pic = msgGen.users.getPhoto(user);
    const fullName = msgGen.users.getFullName(user);
    const initials = msgGen.users.getInitials(user);

    if(pic) return (
      <Image src={pic} alt={fullName} />
    );
    return (
      <Initials>{initials}</Initials>
    )
  }
  render() {
    const {
      assignees,
      maxImages,
      size,
      onClick,
    } = this.props;
    
    if(!assignees.size) return <Button icon="Person" onClick={onClick} />
    
    const extraNumber = Math.max(assignees.size - maxImages, 0);

    return (
      <SwissProvider size={size} images={Math.min(assignees.size, maxImages)}>
        <Wrapper
          onClick={onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <AbsoluteWrapper>
            {assignees.map((user, i) => (i < maxImages) ? (
              <Fragment key={i}>
                <WhiteBackground index={i} />
                <ImageWrapper index={i}>
                  {this.renderImage(user)}
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
