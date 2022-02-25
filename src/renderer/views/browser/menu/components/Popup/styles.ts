import styled from 'styled-components';
import { StyledPopup as StyledBasePopup } from '../../../../../components/Popup/styles';

export const StyledPopup = styled(StyledBasePopup)`
  height: unset;
  max-height: calc(100% - 30px);
  overflow: auto;
`;
