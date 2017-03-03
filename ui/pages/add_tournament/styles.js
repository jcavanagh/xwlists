import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import Select from 'react-select';

export const Form = styled(Paper)`
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

export const FormContainer = styled.div`
    flex: 1;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
`;

export const FormContainerDivider = styled.div`
    width: 1px;
    height: 80%;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #000;
`;

export const FormHeader = styled.div`
    text-transform: uppercase;
    padding: 15px;
    font-size: 14px;
    font-weight: 500;
    background-color: #CCC;
`;

export const FormFieldContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const FormLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    padding-left: 10px;
`;

export const StyledSelect = styled(Select)`
    width: 100%;
`;
