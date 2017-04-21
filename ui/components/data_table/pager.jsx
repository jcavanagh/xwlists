import React from 'react';
import styled from 'styled-components';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const PagerBody = styled.div(`

`);

const PageCell = styled.div(`
    border: 1px solid #000;
    padding: 5px;
    background-color: ${({selected}) => selected ? '#CCC': 'transparent'}
`);

export default class Pager extends React.Component {
    static defaultProps = {
        onChange: () => {}
    }

    onPageCellClick = (index) => this.onChange(index);

    render() {
        const { page = 0, pageSize, length } = this.props;

        const pages = Math.ceil(length / (1.0 * pageSize));
        const pageCells = [];
        for(const x = 0; x < pages; )

        return (
            <PagerBody>
                {pageCells.map((cell, i) => 
                    <PageCell key={i} selected={i === page}>{cell.title} onClick={this.onPageCellClick.bind(this, i)}></PageCell>
                )}
            </PagerBody>
        );
    }
}
