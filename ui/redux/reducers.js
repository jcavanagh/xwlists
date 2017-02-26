export const apiReducer = (state, action) => {
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
            return action.formats;
        case 'FETCH_VENUES':
            return {
                ...state,
                venues: action.data
            };
            return action.formats;
        default:
            return state || {};
    }
}
