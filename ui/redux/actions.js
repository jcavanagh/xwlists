import fetch from 'isomorphic-fetch';
import store from './store';

//Composed actions for routes
export const routeAddTournamentActions = () =>
    (dispatch) => Promise.all([
        dispatch(fetchSets),
        dispatch(fetchFormats),
        dispatch(fetchVenues)
    ])

//Action creator factory - HOW DEEP CAN WE GO?
const fetchRemote = (type, stateKey, url, payload) =>
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

//Locations
const GEOCODE_API = 'http://nominatim.openstreetmap.org/reverse';

//Create action to fetch address from lat/long
const geocode = (latitude, longitude) => (dispatch, getState) => {
    if(latitude && longitude) {
        return fetch(`${GEOCODE_API}?lat=${latitude}&lon=${longitude}&format=json`).then(resp => resp.json()).then(
            locResp => {
                dispatch({
                    type: 'LOCATION_UPDATE',
                    location: locResp.address
                })
            },
            failResp => {
                dispatch({
                    type: 'LOCATION_ERROR',
                    error: failResp
                });
            }
        );
    }
}

//Add geolocation event watcher
let watcher;
if('geolocation' in navigator) {
    watcher = navigator.geolocation.watchPosition(function(position) {
        store.dispatch(
            geocode(position.coords.latitude, position.coords.longitude),
            error => {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        store.dispatch({
                            type: 'LOCATION_DISABLED'
                        });
                        break;
                    default:
                        store.dispatch({
                            type: 'LOCATION_ERROR',
                            error
                        });
                }
            }
        );
    });
}