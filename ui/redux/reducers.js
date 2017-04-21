import * as countries from 'data/countries';

const apiInitial = {
    sets: [],
    setsList: [],   //TODO: react-select specific mappings probably don't belong here
    formats: [],
    venues: [],
    countries: countries.countries,
    states: countries.states
};

export const apiReducer = (state, action) => {
    state = state || apiInitial;

    switch(action.type) {
        case 'FETCH_SETS':
            const sets = action.data || [];
            return {
                ...state,
                sets,
                //For react-select
                setsList: sets.map(title => ({ value: title, label: title }))
            };
        case 'FETCH_FORMATS':
            return {
                ...state,
                formats: action.data
            };
        case 'FETCH_VENUES':
            const venues = action.data ? action.data : [];
            return {
                ...state,
                venues,
                //For react-select
                venuesList: venues.map(title => ({ value: title, label: title }))
            };

        case 'FETCH_TOURNAMENTS':
            return {
                ...state,
                tournaments: action.data
            }
        default:
            return state;
    }
}

const locationInitial = {
    loading: false,
    disabled: false,
    error: false
};
export const locationReducer = (state, action) => {
    state = state || locationInitial;

    switch(action.type) {
        case 'LOCATION_UPDATE':
            return {
                ...action.location,
                disabled: false,
                error: false,
                loading: false
            };
        case 'LOCATION_LOADING':
            return {
                loading: true
            };
        case 'LOCATION_DISABLED':
            return {
                ...state,
                disabled: true
            };
        case 'LOCATION_ERROR':
            return {
                ...state,
                error: true
            }
        default:
            return state
    }
}