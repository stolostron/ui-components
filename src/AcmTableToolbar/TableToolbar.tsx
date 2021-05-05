/* Copyright Contributors to the Open Cluster Management project */

import { Toolbar, ToolbarContent } from '@patternfly/react-core'
import React, { useCallback } from 'react'
import { TableActionsToolbar, TableActionsToolbarProps } from './TableActionsToolbar'
import { TableFiltersToolbarGroup, TableFiltersToolbarProps } from './TableFiltersToolbarGroup'
import { TablePaginationToolbar, TablePaginationToolbarProps } from './TablePaginationToolbar'
import { TableSelectionToolbar, TableSelectionToolbarProps } from './TableSelectionToolbar'

export type TableToolbarProps = TableFiltersToolbarProps &
    TableSelectionToolbarProps &
    TableActionsToolbarProps &
    TablePaginationToolbarProps &
    TableToolbarBreakpoints

export interface TableToolbarBreakpoints {
    selectionBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    filtersBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
    actionsBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
    paginationBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    paginationLargeBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'never'
}

export function TableToolbar(props: TableToolbarProps) {
    const clearAllFilters = useCallback(() => {
        props.filters?.forEach((filter) => filter.setSelections(() => []))
    }, [props.filters])

    return (
        <Toolbar clearAllFilters={clearAllFilters}>
            <ToolbarContent>
                <TableSelectionToolbar {...props} />
                <TableFiltersToolbarGroup {...props} />
                <TableActionsToolbar {...props} />
                <TablePaginationToolbar
                    {...props}
                    // isPaginationCompact={defaultBreakpoints.isPaginationCompact}
                    // isPaginationVisible={defaultBreakpoints.isPaginationVisible}
                />
            </ToolbarContent>
        </Toolbar>
    )
}
