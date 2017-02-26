import fetch from 'isomorphic-fetch';

//Composed actions for routes
export const routeAddTournamentActions = () =>
    (dispatch) => Promise.all([
        dispatch(fetchSets),
        dispatch(fetchFormats),
        dispatch(fetchVenues)
    ])

//Action creator factory - HOW DEEP CAN WE GO?
const fetchRemote = (type, stateKey, url) =>
    (dispatch, getState) => {
        const existing = getState()[stateKey];
        if(existing) {
            return Promise.resolve(existing);
        }

        return fetch(url).then(resp => resp.json()).then(json => dispatch({
            type,
            data: json.data
        }));
    }

//Basic Actions
export const fetchSets = fetchRemote('FETCH_SETS', 'sets', '/api/v1/metadata/sets');
export const fetchFormats = fetchRemote('FETCH_FORMATS', 'formats', '/api/v1/metadata/formats');
export const fetchVenues = fetchRemote('FETCH_VENUES', 'venues', '/api/v1/venues');