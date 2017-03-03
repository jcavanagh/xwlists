import React from 'react';
import styled from 'styled-components';

import CircularProgress from 'material-ui/CircularProgress';

const LocationContainer = styled.div`
    display: flex;
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 14px;
    opacity: 0.5;
`;

const LocationText = styled.span`
    display: flex;
    align-items: center;
`;

export const LocationLoading = () => (
    <LocationContainer>
        <CircularProgress size={20} style={{marginRight: '5px', marginTop: '5px' }} />
        <LocationText>Finding location...</LocationText>
    </LocationContainer>
);

export const LocationError = () => (
    <LocationContainer>
        <i class="material-icons">error</i>
        <LocationText>Location Error!</LocationText>
    </LocationContainer>
);

export const LocationDisabled = () => (
    <LocationContainer>
        <i class="material-icons">error</i>
        <LocationText>Location Disabled :(</LocationText>
    </LocationContainer>
);