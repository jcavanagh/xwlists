import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm as ReduxForm } from 'redux-form';

import fetch from 'isomorphic-fetch';
import { asyncConnect as Connect } from 'redux-connect';

import Select from 'react-select';

import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import ActionHelp from 'material-ui/svg-icons/action/help-outline';

import { SelectField, TextField, DatePicker } from 'redux-form-material-ui';

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

const StyledSelect = styled(Select)`
    width: 100%;
`;

class FormDatePicker extends React.Component {
    onDateChange = (date) => {
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

class FormReactSelectField extends React.Component {
    render() {
        const {input: {value, onBlur, onChange}, initialValue, ...props} = this.props;
        const fieldValue = value || initialValue;
        return (
            <StyledSelect
                multi={true}
                onBlur={() => onBlur(fieldValue)}
                onChange={(newValue) => onChange(newValue)}
                value={fieldValue}
                {...props} />
        );
    }
}

class FormFileField extends React.Component {
    static defaultProps = {
        onFileUploaded: (evt) => {}
    }

    constructor() {
        super();
        this.state = {
            errorOpen: false
        }
    }

    handleErrorClose = () => this.setState({errorOpen: false})

    onFileUploaded = (evt) => {
        try {
            const parsed = JSON.parse(evt.target.result);
            this.props.onFileUploaded(parsed);
        } catch(e) {
            this.setState({errorOpen: true});
        }
    }

    onInputChange = (evt) => {
        if(evt.target.files && evt.target.files.length) {
            const file = evt.target.files[0];
            let reader = new FileReader();
            //TODO: Progress indicator?
            reader.onload = this.onFileUploaded;
            reader.readAsText(file);
        }
    }

    componentDidMount = () => {
        this._fileInput.addEventListener('change', this.onInputChange, false);
    }

    componentWillUnmount = () => {
        this._fileInput.removeEventListener('change', this.onInputChange, false);
    }

    render() {
        const actions = [
            <RaisedButton
                label="Close"
                primary={true}
                onTouchTap={this.handleErrorClose}
            />
        ];

        return (
            <RaisedButton containerElement="label" type="file" label="Cryodex Upload" primary={true}  onChange={this.onInputChange}>
                <input type="file" style={{display: 'none'}} ref={(ref) => this._fileInput = ref} />
                <Dialog title="Upload Failed!" actions={actions} modal={false} open={this.state.errorOpen} onRequestClose={this.handleErrorClose}>
                    <p>Could not parse uploaded file!</p>
                    <p>Please make sure the upload was valid JSON!</p>
                </Dialog>
            </RaisedButton>
        );
    }
}

class TournamentReportPreview extends React.Component {
    extract = (data, field) => {
        const split = field.split('.');

        //Extract nested
        if(split[1]) {
            return this.extract(data[split[0]], split.slice(1).join('.'));
        }

        return data[split[0]];
    }

    render() {
        const { data, fields } = this.props;

        if(!data || !data.length || !fields || !fields.length) { return null; }

        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn colSpan={fields.length} style={{color: 'black', fontSize: '16px', textTransform: 'uppercase'}}>
                            Upload Preview
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        {fields.map(field => (
                            <TableHeaderColumn key={field.key}>{field.title}</TableHeaderColumn>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={true}>
                    {data.map((dataItem, index) => (
                        <TableRow key={index}>
                            {fields.map(field => (
                                <TableRowColumn key={field.key}>{this.extract(dataItem, field.key)}</TableRowColumn>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

class UploadHelpDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    handleOpen = () => this.setState({open: true})
    handleClose = () => this.setState({open: false})

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

@Connect([{
    key: 'sets',
    promise: ({ params, helpers }) => fetch('/api/v1/metadata/sets').then(resp => resp.data)
}])
@ReduxForm({
    form: 'addTourney'
})
class AddTournament extends React.Component {
    constructor() {
        super();

        this.standingsFields = [{
            title: 'Name',
            key: 'name'
        },{
            title: 'MOV',
            key: 'mov'
        },{
            title: 'SOS',
            key: 'sos'
        },{
            title: 'Score',
            key: 'score'
        },{
            title: 'Swiss Rank',
            key: 'rank.swiss'
        },{
            title: 'Champ. Rank',
            key: 'rank.elimination'
        }];

         // this.roundsFields = [{
        //     title: 'Player 1',
        //     key: 'player1'
        // },{
        //     title: 'Points',
        //     key: 'player1points'
        // },{
        //     title: 'Player 2',
        //     key: 'player2'
        // },{
        //     title: 'Points',
        //     key: 'player2points'
        // },{
        //     title: 'Result',
        //     key: 'result'
        // }];

        this.state = {
            cryodexPreview: {}
        }
    }

    setPreview = (cryodexPreview) => this.setState({ cryodexPreview });

    onSelectChange = (value) => this.setState({value});

    render() {
        const { handleSubmit, pristine, sets, submitting } = this.props;
        const { cryodexPreview } = this.state;

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
                        <Divider />
                        <FormFieldContainer>
                            <Field name="tourney_type" label="Tourney Type" component={FormSelectField}>
                                <MenuItem value="60" primaryText="60 minutes" />
                                <MenuItem value="75" primaryText="75 minutes" />
                                <MenuItem value="90" primaryText="90 minutes" />
                            </Field>
                            <FormLabel>OR</FormLabel>
                            <Field name="round_length_userdef" label="Custom Tourney Type" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="participant_count" label="Number of Participants" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                    </FormContainer>
                    <FormContainer>
                        <FormFieldContainer>
                            <Field name="sets" options={sets} initialValue={sets} label="Legal Sets" component={FormReactSelectField} />
                        </FormFieldContainer>
                    </FormContainer>
                </div>
                <FormHeader style={{position: 'relative'}}>
                    Tourney Results
                    <UploadHelpDialog />
                </FormHeader>
                <FormContainer>
                    <Field name="tourney_report" component={FormFileField} onFileUploaded={this.setPreview} />
                    <TournamentReportPreview fields={this.standingsFields} data={cryodexPreview.players} />
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