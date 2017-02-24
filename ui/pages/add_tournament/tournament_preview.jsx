import React from 'react';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class TournamentPreview extends React.Component {
    extract = (data, field) => {
        const split = field.split('.');

        //Extract nested
        if(split[1]) {
            return this.extract(data[split[0]], split.slice(1).join('.'));
        }

        return data[split[0]];
    }

    render() {
        const { data, fields } = this.props;

        if(!data || !data.length || !fields || !fields.length) { return null; }

        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn colSpan={fields.length} style={{color: 'black', fontSize: '16px', textTransform: 'uppercase'}}>
                            Upload Preview
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        {fields.map(field => (
                            <TableHeaderColumn key={field.key}>{field.title}</TableHeaderColumn>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={true}>
                    {data.map((dataItem, index) => (
                        <TableRow key={index}>
                            {fields.map(field => (
                                <TableRowColumn key={field.key}>{this.extract(dataItem, field.key)}</TableRowColumn>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}