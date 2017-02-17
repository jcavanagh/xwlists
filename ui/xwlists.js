import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import { About, AddTournament, Analysis, Search, NotFound, Tournaments, Vassal, WorldMap } from 'pages/index';

render((
    <Router history={browserHistory}>
        <Route path="/" component={Search}>
            <Route path="about" component={About} />
            <Route path="new" component={AddTournament} />
            <Route path="search" component={Search} />
            <Route path="heatmap" component={WorldMap} />
            <Route path="league" component={Vassal} />
            <Route path="time_series" component={Analysis} />
            <Route path="tourneys" component={Tournaments} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
), document.getElementById('xwlists'));