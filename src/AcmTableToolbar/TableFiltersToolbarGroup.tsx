import { SearchInput, ToolbarGroup, ToolbarItem, ToolbarToggleGroup } from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon'
import React from 'react'
import { TableFilter, TableFilterProps } from './TableFilter'

export type TableFiltersToolbarProps<T = unknown> = {
    itemCount: number
    selectedCount: number
    searchedCount: number
    filteredCount: number
    search?: string
    setSearch?: (search: string) => void
    filters?: TableFilterProps<T>[]
    filtersBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
}
export function TableFiltersToolbarGroup<T = unknown>(props: TableFiltersToolbarProps<T>) {
    return (
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint={props.filtersBreakpoint ?? 'md'}>
            {props.setSearch && (
                <ToolbarItem variant="search-filter">
                    <SearchInput
                        id="search"
                        placeholder="Search"
                        value={props.search}
                        onChange={props.setSearch}
                        onClear={() => props.setSearch?.('')}
                        resultsCount={`${props.searchedCount} / ${
                            props.filteredCount !== undefined ? props.filteredCount : props.itemCount
                        }`}
                    />
                </ToolbarItem>
            )}
            {props.filters && (
                <ToolbarGroup variant="filter-group">
                    {props.filters.map((filter) => (
                        <TableFilter key={filter.label} {...filter} />
                    ))}
                </ToolbarGroup>
            )}
        </ToolbarToggleGroup>
    )
}
