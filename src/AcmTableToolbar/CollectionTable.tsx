/* eslint-disable react/display-name */

import {
    IExtraColumnData,
    IRow,
    ISortBy,
    SortByDirection,
    Table,
    TableBody,
    TableGridBreakpoint,
    TableHeader,
} from '@patternfly/react-table'
import React from 'react'
import { PagedCollection, SelectedCollection } from './collections'
import { TableActionsToolbarProps } from './TableActionsToolbar'
import { IRowColumn } from './useRows'

export function CollectionTable<T = unknown>(props: {
    columns: IRowColumn<T>[]
    rows: IRow[]
    sortBy?: ISortBy
    setSortBy: (sort: ISortBy) => void
    selected: SelectedCollection<T>
    paged: PagedCollection<T>
    tableActions?: TableActionsToolbarProps[]
}) {
    return (
        <Table
            aria-label="TODO"
            cells={props.columns}
            rows={props.rows}
            sortBy={props.sortBy}
            onSort={(
                _event: React.MouseEvent,
                index: number,
                direction: SortByDirection,
                _extraData: IExtraColumnData
            ) => {
                props.setSortBy({ index, direction })
            }}
            onSelect={(
                _event: React.FormEvent<HTMLInputElement>,
                _isSelected: boolean,
                rowIndex: number
                // rowData: IRowData,
                // extraData: IExtraData
            ) => {
                if (rowIndex === -1) {
                    props.selected.selectAll()
                } else {
                    const item = props.paged.items()[rowIndex]
                    if (props.selected.includes(item)) {
                        props.selected.removeKey(props.paged.getKey(item))
                    } else {
                        props.selected.insertItem(item)
                    }
                }
            }}
            canSelectAll={false}
            isStickyHeader
            variant="compact"
            gridBreakPoint={TableGridBreakpoint.none}
        >
            <TableHeader />
            {props.rows.length > 0 && <TableBody />}
        </Table>
    )
}
