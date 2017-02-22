import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm as ReduxForm } from 'redux-form';

import Select from 'react-select';

import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import ActionHelp from 'material-ui/svg-icons/action/help-outline';

import { SelectField, TextField, DatePicker} from 'redux-form-material-ui';

const Form = styled(Paper)`
    display: flex;
    flex-direction: column;
    overflow: auto;
`;

const FormContainer = styled.div`
    flex: 1;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
`;

const FormContainerDivider = styled.div`
    width: 1px;
    height: 80%;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #000;
`;

const FormHeader = styled.div`
    text-transform: uppercase;
    padding: 15px;
    font-size: 14px;
    font-weight: 500;
    background-color: #CCC;
`;

const FormFieldContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const FormLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    padding-left: 10px;
`;

class FormDatePicker extends React.Component {
    onDateChange = (evt, date) => {
        //Format how backend wants it
        const formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        this.props.input.onChange(formatted);
    }

    render() {
        const { input: { value } } = this.props;
        const asDate = value ? new Date(value) : new Date();
        return (
            <DatePicker {...this.props} hintText={this.props.label} container="inline" mode="landscape" autoOk={true} onChange={this.onDateChange} value={asDate} />
        )
    }
}

const FormTextField = (props) => (
    <TextField
        hintText={props.label}
        hintStyle={{transition: 'none'}}
        type={props.type}
        underlineShow={false}
        errorText={props.touched && props.error}
        {...props}
    />
)

const FormSelectField = (props) => (
    <SelectField hintText={props.label} {...props} onChange={(event, index, value) => props.input.onChange(value)} {...props} />
)

class FormFileField extends React.Component {
    onFileUploaded = (evt) => {
        debugger;
    }

    onInputChange = (evt) => {
        if(evt.target.files && evt.target.files.length) {
            const file = evt.target.files[0];
            let reader = new FileReader();
            //TODO: Progress indicator?
            reader.onload = this.onFileUploaded;
            reader.readAsDataURL(file);
        }
    };

    componentDidMount = () => {
        this._fileInput.addEventListener('change', this.onInputChange, false);
    };

    componentWillUnmount = () => {
        this._fileInput.removeEventListener('change', this.onInputChange, false);
    };

    render() {
        return (
            <RaisedButton containerElement="label" type="file" label="Cryodex Upload" primary={true}  onChange={this.onInputChange}>
                <input type="file" style={{display: 'none'}} ref={(ref) => this._fileInput = ref} />
            </RaisedButton>
        );
    }
}

const TournamentReportPreview = (props) => (<div />);

class UploadHelpDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <RaisedButton
                label="Close"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];

        return (
            <div>
                <FloatingActionButton onTouchTap={this.handleOpen} mini={true} style={{position: 'absolute', top: '3px', left: '150px', transform: 'scale(0.6)'}}>
                    <ActionHelp />
                </FloatingActionButton>
                <Dialog title="Upload Help" actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                    <p>Leave blank if you didn't use Cryodex</p>
                    <p>Else, in Cryodex go to Export->Export X-Wing List Juggler Data.</p>
                    <p>This will create a file called 'xwingtournament.json' in the folder where your Cryodex.jar file lives.</p>
                    <p>Note: If you don't have this option in Cryodex, you need to upgrade to the latest version of Cryodex!</p>
                </Dialog>
            </div>
        );
    }
}

@ReduxForm({
    form: 'addTourney'
})
class AddTournament extends React.Component {
    render() {
        const { handleSubmit, pristine, submitting } = this.props;

        return (
            <Form zDepth={2} onSubmit={handleSubmit}>
                <FormHeader>{"Tourney Details"}</FormHeader>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <FormContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="name" label="Tourney Name" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="email" label="Contact Email (Private)" type="email" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="tourney_format_dropdown" label="Tourney Format" component={FormSelectField}>
                                <MenuItem value="kittens" primaryText="Kittens" />
                            </Field>
                            <FormLabel>OR</FormLabel>
                            <Field name="tourney_format_custom" label="Custom Tourney Format" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="datepicker" component={FormDatePicker} />
                        </FormFieldContainer>
                    </FormContainer>
                    <FormContainer>

                    </FormContainer>
                </div>
                <FormHeader style={{position: 'relative'}}>
                    Tourney Results
                    <UploadHelpDialog />
                </FormHeader>
                <FormContainer>
                    <Field name="tourney_report" component={FormFileField} />
                    <TournamentReportPreview />
                </FormContainer>
                <Toolbar style={{flexDirection: 'row-reverse'}}>
                    <ToolbarGroup lastChild={true} >
                        <RaisedButton type="submit" disabled={pristine || submitting} label="Submit" />
                    </ToolbarGroup>
                </Toolbar>
            </Form>
        );
    }
}

export default AddTournament;