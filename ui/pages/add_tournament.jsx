import React from 'react';
import { Field, reduxForm as ReduxForm } from 'redux-form';

import DatePicker from 'material-ui/DatePicker';

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
            <DatePicker hintText="Select a Date" container="inline" mode="landscape" autoOk={true} onChange={this.onDateChange} value={asDate} />
        )
    }
}

@ReduxForm({
    form: 'addTourney'
})
class AddTournament extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div>
                    <label htmlFor="name">Tourney Name</label>
                    <Field name="name" component="input" type="text"/>
                </div>
                <div>
                    <label htmlFor="email">Email (Private)</label>
                    <Field name="email" component="input" type="email"/>
                </div>
                <div>
                    <label htmlFor="tourney_format_dropdown">Tourney Format</label>
                    <Field name="tourney_format_dropdown" component="select" />
                    <label htmlFor="tourney_format_custom">Or, enter a custom format</label>
                    <Field name="tourney_format_custom" component="input" type="text" />
                </div>
                <div>
                    <label htmlFor="datepicker">Date Played</label>
                    <Field name="datepicker" component={FormDatePicker} />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default AddTournament;