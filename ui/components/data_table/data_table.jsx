import React from 'react';

import Pager from './pager';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

export default class DataTable extends React.Component {
    constructor(props) {
        super();

        this.state = {
            currentPage: props.currentPage || 0,
            sort: {
                column: props.fields[0],
                ascending: true
            }
        };
    }

    extract = (data, field) => {
        const split = field.split('.');

        //Extract nested
        if(data[split[0]]) {
            if(split[1]) {
                return this.extract(data[split[0]], split.slice(1).join('.'));
            }

            return data[split[0]];
        }
    }

    onCellClick = () => {
        debugger;
    }

    onPageChange = (currentPage) => {
        this.setState({ currentPage});
    }

    onSortChange = (column) => {
        const currentSort = this.state.sort;
        let newSort;
        if(currentSort && currentSort.column === column) {
            newSort = currentSort;
            newSort.ascending = !newSort.ascending
        } else {
            newSort = {
                column,
                asending: true
            }
        }
        this.setState({ sort: newSort });
    }

    render() {
        const { data, fields, title, pageSize = 100 } = this.props;
        const { currentPage, sort } = this.state;

        if(!data || !data.length || !fields || !fields.length) { return null; }

        const sorted = data.sort((a, b) => {
            if(sort) {
                const aVal = a[sort.column];
                const bVal = b[sort.column];
                if(aVal > bVal) { return 1; }
                if(aVal < bVal) { return 1; }
            }

            return 0;
        });
        const toRender = sorted.slice(currentPage * pageSize, pageSize);

        return (
            <div>
                <Table selectable={false} onCellClick={this.onCellClick}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn colSpan={fields.length} style={{color: 'black', fontSize: '16px', textTransform: 'uppercase'}}>
                                {title}
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            {fields.map(field => (
                                <TableHeaderColumn key={field.key} onClick={this.onSortChange.bind(this, field)} style={{cursor: 'pointer'}}>{field.title}</TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {toRender.map((dataItem, index) => (
                            <TableRow key={index}>
                                {fields.map(field => (
                                    <TableRowColumn key={field.key}>{this.extract(dataItem, field.key)}</TableRowColumn>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pager page={currentPage} pageSize={pageSize} length={data.length} onChange={this.onPageChange} />
            </div>
        );
    }
}
