import React from 'react';
import SW from './CardHeader.swiss';

const CardHeader = ({
  children,
  padding,
  title,
  onTitleClick,
  subtitle,
  className,
  inputRef,
  ...rest
}) => {
  const isInput = !!rest.onChange;
  return (
    <SW.Wrapper className={className} padding={padding} subtitle={!!subtitle}>
      <SW.Title key="header-title" onClick={onTitleClick}>
        {isInput ? <SW.Input type="text" ref={inputRef} {...rest} /> : title}
        {subtitle && <SW.Subtitle>{subtitle}</SW.Subtitle>}
      </SW.Title>
      <SW.Actions>{children}</SW.Actions>
    </SW.Wrapper>
  );
};
export default CardHeader;
