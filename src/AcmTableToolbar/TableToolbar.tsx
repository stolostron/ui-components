import { Toolbar, ToolbarContent } from '@patternfly/react-core'
import React, { useCallback } from 'react'
import { TableActionsToolbar, TableActionsToolbarProps } from './TableActionsToolbar'
import { TableFiltersToolbarGroup, TableFiltersToolbarProps } from './TableFiltersToolbarGroup'
import { TablePaginationToolbar, TablePaginationToolbarProps } from './TablePaginationToolbar'
import { TableSelectionToolbar, TableSelectionToolbarProps } from './TableSelectionToolbar'
import './TableToolbar.css'

export type TableToolbarProps<T> = TableFiltersToolbarProps<T> &
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

export function TableToolbar<T>(props: TableToolbarProps<T>) {
    const clearAllFilters = useCallback(() => {
        props.filters?.forEach((filter) => filter.setSelections(() => []))
    }, [props.filters])

    return (
        <Toolbar clearAllFilters={clearAllFilters} inset={{ lg: 'insetMd', xl: 'insetLg' }}>
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
