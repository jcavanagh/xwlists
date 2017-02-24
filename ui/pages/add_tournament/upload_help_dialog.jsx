import React from 'react';

import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionHelp from 'material-ui/svg-icons/action/help-outline';

export default class UploadHelpDialog extends React.Component {
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