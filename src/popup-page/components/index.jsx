import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const IndexPage = () => {
  return <StyledWrapper></StyledWrapper>;
};

export default React.memo(IndexPage);
