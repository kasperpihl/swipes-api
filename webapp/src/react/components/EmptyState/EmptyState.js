import React from 'react';
import parseLinks from 'src/utils/parseLinks';
import parseNewLines from 'src/utils/parseNewLines';
import SW from './EmptyState.swiss';

const EmptyState = props => {
  return (
    <SW.ProvideContext
      large={!!props.large}
      fill={!!props.fill}
      takeAction={props.takeAction}
      searchResult={props.searchResult}
      page={props.page}
    >
      <SW.Wrapper>
        {props.icon && (
          <SW.ImageWrapper>
            <SW.Image icon={props.icon} />
          </SW.ImageWrapper>
        )}
        <SW.Title>{props.title}</SW.Title>
        <SW.Description>
          {parseLinks(parseNewLines(props.description))}
        </SW.Description>
      </SW.Wrapper>
    </SW.ProvideContext>
  );
};

export default EmptyState;
