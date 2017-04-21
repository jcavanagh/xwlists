import React from 'react';
import { Field, formValueSelector, reduxForm as ReduxForm } from 'redux-form';

import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import { LocationDisabled, LocationError, LocationLoading } from './location';
import { Form, FormContainer, FormContainerDivider, FormHeader, FormFieldContainer, FormLabel } from './styles';
import DataTable from 'components/data_table/data_table';
import UploadHelpDialog from './upload_help_dialog';

//Route wiring
import Connect from 'components/connect/connect';
import { routeAddTournamentActions } from 'redux/actions';

//Fields
import { FormDatePicker, FormFileField, FormTextField, FormSelectField, FormReactSelectField } from './fields';

const FORM_NAME = 'addTourney';
const selector = formValueSelector(FORM_NAME);

@Connect(
    [routeAddTournamentActions()],
    state => {
        const formValues = state.form[FORM_NAME] ? state.form[FORM_NAME].values : {};
        const country = selector(state, 'country') || state.location.country;
        const states = country ? state.api.states[country] : [];
        return {
            api: state.api,
            location: state.location,
            states,
            initialValues: {
                tourney_format_dropdown: state.api.formats ? state.api.formats[0] : null,
                round_length_dropdown: '60',
                //Override any of that with selected form values - needed when enableReinitialize is true
                ...formValues,
                //Autofill from location if we have it, must manually preserve existing if present
                country,
                state: selector(state, 'state') || state.location.state,
                city: selector(state, 'city') || state.location.city,
            }
        }
    }
)
@ReduxForm({
    form: FORM_NAME,
    enableReinitialize: true
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
        const { api, handleSubmit, location, pristine, states, submitting } = this.props;
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
                                {api.formats.map(format =>
                                    <MenuItem key={format} value={format} primaryText={format} />
                                )}
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
                            <Field name="round_length_dropdown" label="Round Length" component={FormSelectField}>
                                <MenuItem value="60" primaryText="60 minutes" />
                                <MenuItem value="75" primaryText="75 minutes" />
                                <MenuItem value="90" primaryText="90 minutes" />
                            </Field>
                            <FormLabel>OR</FormLabel>
                            <Field name="round_length_userdef" label="Custom Round Length" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                        <FormFieldContainer>
                            <Field name="participant_count" label="Number of Participants" component={FormTextField} />
                        </FormFieldContainer>
                        <Divider />
                    </FormContainer>
                    <FormContainer>
                        {location.disabled ? <LocationDisabled /> : null}
                        {location.error ? <LocationError /> : null}
                        {location.loading ? <LocationLoading /> : null}
                        <FormFieldContainer>
                            <Field name="country" label="Country" component={FormSelectField}>
                                {api.countries.map(country =>
                                    <MenuItem key={country} value={country} primaryText={country} />
                                )}
                            </Field>
                        </FormFieldContainer>
                        <FormFieldContainer>
                            <Field name="state" label="State" component={FormSelectField}>
                                {states.map(state =>
                                    <MenuItem key={state} value={state} primaryText={state} />
                                )}
                            </Field>
                        </FormFieldContainer>
                        <FormFieldContainer>
                            <Field name="city" label="City" component={FormTextField} />
                        </FormFieldContainer>
                        <FormFieldContainer>
                            <Field name="venue" options={api.venuesList} placeholder="Venue" multi={false} creatable={true} component={FormReactSelectField} />
                        </FormFieldContainer>
                        <FormFieldContainer>
                            <Field name="sets" options={api.setsList} initialValue={api.setsList} placeholder="Legal Sets" clearable={false} component={FormReactSelectField} />
                        </FormFieldContainer>
                    </FormContainer>
                </div>
                <FormHeader style={{position: 'relative'}}>
                    Tourney Results
                    <UploadHelpDialog />
                </FormHeader>
                <FormContainer>
                    <Field name="tourney_report" component={FormFileField} onFileUploaded={this.setPreview} />
                    <DataTable title="Upload Preview" fields={this.standingsFields} data={cryodexPreview.players} />
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