import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { SelectField, TextField, DatePicker } from 'redux-form-material-ui';

import { StyledCreatable, StyledSelect } from './styles';

export class FormFileField extends React.Component {
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

export class FormDatePicker extends React.Component {
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

export const FormTextField = (props) => (
    <TextField
        hintText={props.label}
        hintStyle={{transition: 'none'}}
        type={props.type}
        underlineShow={false}
        errorText={props.touched && props.error}
        {...props}
    />
)

export class FormSelectField extends React.Component {
    render() {
        return (
            <SelectField hintText={this.props.label} {...this.props} onChange={this.props.input.onChange} />
        );
    }
}

export class FormReactSelectField extends React.Component {
    render() {
        const {input: {value, onBlur, onChange}, creatable, initialValue, ...props} = this.props;
        const fieldValue = value || initialValue;
        const Component = creatable ? StyledCreatable : StyledSelect;

        return (
            <Component
                multi={true}
                onBlur={() => onBlur(fieldValue)}
                onChange={(newValue) => onChange(newValue ? newValue.value : null)}
                value={fieldValue}
                {...props} />
        );
    }
}