import React from 'react';
import styled from 'styled-components';

import CircularProgress from 'material-ui/CircularProgress';

const SPINNER_SIZE = 70;

const LoadMask= styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: 1000;
`;

const Spinner = styled(CircularProgress)`
    top: calc(50% - ${SPINNER_SIZE / 2}px);
    left: calc(50% - ${SPINNER_SIZE / 2}px);
`;

export default class Loading extends React.Component {
    render() {
        return (
            <LoadMask>
                <Spinner size={SPINNER_SIZE} thickness={5} />
            </LoadMask>
        );
    }
}