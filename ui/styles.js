import styled from 'styled-components';

import Paper from 'material-ui/Paper';

export const AppRoot = styled.div`
    min-height: 100vh;
    background-image: linear-gradient(-180deg, #FCFCFC 0%, #EAEAEA 100%);
`;

export const Content = styled.div`
    height: 100%;
    padding: 20px;
`;

export const TopBarContainer = styled.div`
    display: flex;
`;

export const Spacer = styled.span`
    flex-grow: 1;
`;

export const Title = styled.span`
    font-weight: 300
`;

export const SmallTitle = styled(Title)`
    font-size: 16px;
`;

export const TitleIcon = styled(Paper)`
  height: 40px;
  width: 40px;
  margin: 12px 20px 0px 20px;
  padding: 5px;
  textAlign: center;
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
`;

export const IconImage = styled.div`
    background-image: ${({src}) => `url(${src})`};
    background-size: cover;
    image-rendering: -webkit-optimize-contrast;
    width: 30px;
    height: 30px;
`;

export const FlexLink = styled.a`
    display: flex;
    color: inherit;
`;