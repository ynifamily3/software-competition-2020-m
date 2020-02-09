import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  /* all: unset; */
  margin: 0;
  background: ${(props: { background?: string }) =>
    props.background ? '#ecd5a7' : '#ecf0f3'};

  word-break: normal;
  word-wrap: break-word;
  border: 0;
  padding: 1em 2em;
  border-radius: 10px;
  box-shadow: ${(props: { background?: string }) =>
    props.background
      ? '30px 30px 60px #c9b58e, -30px -30px 60px #fff5c0'
      : '30px 30px 60px #c9cccf, -30px -30px 60px #ffffff'};
  &:active {
    background: ${(props: { background?: string }) =>
      props.background ? '#ecd5a7' : '#ecf0f3'};
    box-shadow: ${(props: { background?: string }) =>
      props.background
        ? 'inset 30px 30px 60px #c9b58e, inset -30px -30px 60px #fff5c0'
        : 'inset 30px 30px 60px #c9cccf, inset -30px -30px 60px #ffffff'};
    color: inherit;
  }
`;
// enable, default
// disabled
// active
// hover
// focus
// pressed

function NewButton(props: any) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}

export default NewButton;
