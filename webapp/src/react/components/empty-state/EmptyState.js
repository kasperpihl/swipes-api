import React from 'react'
import { SwissProvider } from 'swiss-react';
import parseLinks from 'src/utils/parseLinks';
import parseNewLines from 'src/utils/parseNewLines';
import SW from './EmptyState.swiss';

const EmptyState = (props) => {
  return (
    <SwissProvider large={!!props.large} fill={!!props.fill} takeAction={props.takeAction}>
      <SW.Wrapper>
        {props.icon && (
          <SW.ImageWrapper>
            <SW.Image icon={props.icon}/>
          </SW.ImageWrapper>
        )}
        <SW.Title>
          {props.title}
        </SW.Title>
        <SW.Description>
          {parseLinks(parseNewLines(props.description))}
        </SW.Description>
      </SW.Wrapper>
    </SwissProvider>
  )
}

export default EmptyState;
