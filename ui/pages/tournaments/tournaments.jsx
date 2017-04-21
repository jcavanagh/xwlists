import React from 'react';

import { fetchTournaments } from 'redux/actions';
import Connect from 'components/connect/connect';
import DataTable from 'components/data_table/data_table';

const TOURNAMENT_FIELDS = [{
    title: 'ID',
    key: 'id',
    header: {
        style: {
            maxWidth: '50px'
        }
    },
    cell: {
        style: {}
    }
},{
    title: 'Name',
    key: 'name'
},{
    title: 'Venue',
    key: 'venue.name'
},{
    title: 'Num. Players',
    key: 'num_players'
},{
    title: 'Results',
    key: ''
},{
    title: 'Type',
    key: 'type'
},{
    title: 'Date Played',
    key: 'date'
},{
    title: 'Round Length',
    key: 'round_length'
},{
    title: 'Venue Detail',
    key: 'venue.city'
},{
    title: 'Export Lists',
    key: ''
}];

@Connect(
    [fetchTournaments],
    state => ({
        tournaments: state.api.tournaments
    })
)
export default class Tournaments extends React.Component {
    render() {
        const { tournaments } = this.props;
        return (
            <div>
                <DataTable title="Tournaments" fields={TOURNAMENT_FIELDS} data={tournaments} />
            </div>
        );
    }
}
