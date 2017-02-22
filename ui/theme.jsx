import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { darkBlack, grey800, cyan500 } from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const theme = {
    fontFamily: 'Helvetica Neue, Helvetica, Lucida Grande, sans-serif',
    palette: {
        primary1Color: grey800,
        primary2Color: cyan500,
        primary3Color: grey800,
        accent1Color: cyan500,
        accent2Color: cyan500,
        accent3Color: cyan500,
        disabledColor: fade(darkBlack, 0.4),
    }
};

export default getMuiTheme(theme);