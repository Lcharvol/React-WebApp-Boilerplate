import styled from "styled-components";

import { BACKGROUND_COLOR } from "../../constants/colors";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background-color: ${BACKGROUND_COLOR};
  font-family: "Raleway", sans-serif;
  color: white;
  font-weight: 0;
  font-size: 3em;
`;
