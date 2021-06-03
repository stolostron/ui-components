/* Copyright Contributors to the Open Cluster Management project */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { makeStyles } from '@material-ui/styles'
import {
    ButtonVariant,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    EmptyState,
    EmptyStateIcon,
    PageSection,
    Pagination,
    PaginationVariant,
    PerPageOptions,
    SearchInput,
    Spinner,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    Tooltip,
} from '@patternfly/react-core'
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon'
import {
    IAction,
    IActionsResolver,
    IExtraData,
    IRow,
    IRowData,
    ISortBy,
    ITransform,
    nowrap,
    RowWrapper,
    RowWrapperProps,
    sortable,
    SortByDirection,
    Table,
    TableBody,
    TableGridBreakpoint,
    TableHeader,
    TableVariant,
} from '@patternfly/react-table'
import useResizeObserver from '@react-hook/resize-observer'
import Fuse from 'fuse.js'
import get from 'get-value'
import React, {
    createContext,
    FormEvent,
    Fragment,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmEmptyState } from '../AcmEmptyState/AcmEmptyState'

type SortFn<T> = (a: T, b: T) => number
type CellFn<T> = (item: T) => ReactNode
type SearchFn<T> = (item: T) => string | boolean | number | string[] | boolean[] | number[]

/* istanbul ignore next */
export interface IAcmTableColumn<T> {
    /** the header of the column */
    header: string

    tooltip?: string

    /** enables sort either on field name of using sort function */
    sort?: SortFn<T> | string

    /** if defined will enable search of the search field */
    search?: SearchFn<T> | string

    /** cell content, either on field name of using cell function */
    cell: CellFn<T> | string

    transforms?: ITransform[]

    cellTransforms?: ITransform[]
}

/* istanbul ignore next */
export interface IAcmTableAction {
    id: string
    title: string | React.ReactNode
    click: () => void
    isDisabled?: boolean | undefined
    tooltip?: string | React.ReactNode
    variant?: ButtonVariant
}

/* istanbul ignore next */
export interface IAcmRowAction<T> {
    /** Action identifier */
    id: string
    /** Display a tooltip for this action */
    tooltip?: string
    /** Inject a separator horizontal rule immediately before an action */
    addSeparator?: boolean
    /** Display an action as being disabled */
    isDisabled?: boolean
    /** Visible text for action */
    title: string | React.ReactNode
    /** Function for onClick() action */
    click: (item: T) => void
}

/* istanbul ignore next */
export interface IAcmTableBulkAction<T> {
    id: string
    title: string | React.ReactNode
    click: (items: T[]) => void
    isDisabled?: boolean
    tooltip?: string | React.ReactNode
}

interface ITableItem<T> {
    item: T
    key: string
    group?: string
    subItems?: T[]
    subRows?: IRow[]
    [key: string]: unknown
}

const useStyles = makeStyles({
    tableDiv: {
        display: 'table',
        width: '100%',
    },
    outerDiv: {
        display: 'block',
    },
    table: {
        '& tbody.pf-m-expanded > tr': {
            borderBottom: 0,
            '&:first-of-type, &:last-of-type': {
                borderBottom: 'var(--pf-c-table--border-width--base) solid var(--pf-c-table--BorderColor)',
            },
        },
    },
})

function countGroups(items: ITableItem<unknown>[]): number {
    const { ungrouped, groups } = items.reduce(
        (acc, item) => {
            if (item.group) {
                acc.groups.add(item.group)
            } else {
                acc.ungrouped++
            }
            return acc
        },
        { ungrouped: 0, groups: new Set() }
    )
    return ungrouped + groups.size
}

function OuiaIdRowWrapper(props: RowWrapperProps) {
    return <RowWrapper {...props} ouiaId={get(props, 'row.props.key')} />
}

const DEFAULT_ITEMS_PER_PAGE = 10

const BREAKPOINT_SIZES = [
    { name: TableGridBreakpoint.none, size: 0 },
    { name: TableGridBreakpoint.gridMd, size: 768 },
    { name: TableGridBreakpoint.gridLg, size: 992 },
    { name: TableGridBreakpoint.gridXl, size: 1200 },
    { name: TableGridBreakpoint.grid2xl, size: 1450 },
    { name: TableGridBreakpoint.grid, size: Infinity },
]

const AcmTablePaginationContext: React.Context<{
    perPage?: number
    setPerPage?: (perPage: number) => void
}> = createContext({})

export function AcmTablePaginationContextProvider(props: { children: ReactNode; localStorageKey: string }) {
    const { children, localStorageKey } = props
    const [perPage, setPerPage] = useState(
        parseInt(localStorage.getItem(localStorageKey) || '0', 10) || DEFAULT_ITEMS_PER_PAGE
    )
    const paginationContext = {
        perPage,
        setPerPage: (perPage: number) => {
            localStorage.setItem(localStorageKey, String(perPage))
            setPerPage(perPage)
        },
    }
    return <AcmTablePaginationContext.Provider value={paginationContext}>{children}</AcmTablePaginationContext.Provider>
}

export interface AcmTableProps<T> {
    plural: string
    items?: T[]
    addSubRows?: (item: T) => IRow[] | undefined
    initialSelectedItems?: T[]
    columns: IAcmTableColumn<T>[]
    keyFn: (item: T) => string
    groupFn?: (item: T) => string | null
    groupSummaryFn?: (items: T[]) => IRow
    tableActions?: IAcmTableAction[]
    rowActions?: IAcmRowAction<T>[]
    rowActionResolver?: (item: T) => IAcmRowAction<T>[]
    bulkActions?: IAcmTableBulkAction<T>[]
    extraToolbarControls?: ReactNode
    emptyState?: ReactNode
    onSelect?: (items: T[]) => void
    page?: number
    setPage?: (page: number) => void
    search?: string
    setSearch?: (search: string) => void
    searchPlaceholder?: string
    initialSort?: ISortBy | undefined
    sort?: ISortBy | undefined
    setSort?: (sort: ISortBy | undefined) => void
    showToolbar?: boolean
    gridBreakPoint?: TableGridBreakpoint
    perPageOptions?: PerPageOptions[]
    autoHidePagination?: boolean
    noBorders?: boolean
    fuseThreshold?: number
}
export function AcmTable<T>(props: AcmTableProps<T>) {
    const {
        items,
        columns,
        addSubRows,
        keyFn,
        groupFn,
        groupSummaryFn,
        bulkActions = [],
        rowActions = [],
        rowActionResolver,
        tableActions = [],
    } = props
    const adjustedSortIndexOffset = bulkActions && bulkActions.length ? 1 : 0
    const sortIndexOffset = adjustedSortIndexOffset + (groupFn || addSubRows ? 1 : 0)

    const defaultSort = {
        index: sortIndexOffset,
        direction: SortByDirection.asc,
    }
    const initialSort = props.initialSort || defaultSort

    // State that is only stored in the component state
    const [selected, setSelected] = useState<{ [uid: string]: boolean }>({})
    const [actionsOpen, setActionsOpen] = useState(false)
    const [preFilterSort, setPreFilterSort] = useState<ISortBy | undefined>(initialSort)
    const [expanded, setExpanded] = useState<{ [uid: string]: boolean }>({})
    const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({})

    // State that can come from context or component state (perPage)
    const [statePerPage, stateSetPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)
    const { perPage: contextPerPage, setPerPage: contextSetPerPage } = useContext(AcmTablePaginationContext)
    const perPage = contextPerPage || statePerPage
    const setPerPage = contextSetPerPage || stateSetPerPage

    // State that can be controlled from component props or uncontrolled from component state (page, search, sort)
    const [statePage, stateSetPage] = useState(1)
    const page = props.page || statePage
    const setPage = props.setPage || stateSetPage
    const [stateSearch, stateSetSearch] = useState('')
    const search = props.search || stateSearch
    const setSearch = props.setSearch || stateSetSearch
    const searchPlaceholder = props.searchPlaceholder || 'Search'
    const [stateSort, stateSetSort] = useState<ISortBy | undefined>(initialSort)
    const sort = props.sort || stateSort
    const setSort = props.setSort || stateSetSort

    // Dynamic gridBreakPoint
    const [breakpoint, setBreakpoint] = useState<TableGridBreakpoint>(TableGridBreakpoint.none)
    const [exactBreakpoint, setExactBreakpoint] = useState<number | undefined>()
    const [outerDiv, setOuterDiv] = useState<HTMLDivElement | null>(null)
    const [tableDiv, setTableDiv] = useState<HTMLDivElement | null>(null)
    const outerDivRef = useCallback((elem) => setOuterDiv(elem), [])
    const tableDivRef = useCallback((elem) => setTableDiv(elem), [])

    /* istanbul ignore next */
    const updateBreakpoint = (width: number, tableWidth: number) => {
        const viewportWidth = window.innerWidth
        if (tableWidth > width) {
            // table needs to switch to cards; make the change and record viewport size when this happened
            const newBreakpoint =
                BREAKPOINT_SIZES.find((b) => viewportWidth <= b.size)?.name || TableGridBreakpoint.none
            setBreakpoint(newBreakpoint)
            setExactBreakpoint(width)
        } else if (exactBreakpoint && width > exactBreakpoint) {
            // outerDiv is now bigger than when we last switched to cards; try bigger breakpoint, which will
            // be reverted in the layout effect if the table view is still too wide
            const newBreakpoint =
                [...BREAKPOINT_SIZES].reverse().find((b) => viewportWidth > b.size)?.name || TableGridBreakpoint.grid
            setBreakpoint(newBreakpoint)
        }
    }

    useLayoutEffect(
        () => {
            if (!props.gridBreakPoint && outerDiv && tableDiv) {
                updateBreakpoint(outerDiv.clientWidth, tableDiv.clientWidth)
            }
        },
        // Check breakpoints as soon as ref callbacks are set, in case initial viewport is too small for table
        // Need to check on every update to breakpoint as well for the same case, so that display
        // doesn't thrash between table/cards on initial expansion of viewport
        [breakpoint, outerDiv, tableDiv]
    )

    /* istanbul ignore next */
    useResizeObserver(outerDiv, () => {
        if (!props.gridBreakPoint && outerDiv && tableDiv) {
            const width = outerDiv.clientWidth
            const tableWidth = tableDiv.clientWidth
            updateBreakpoint(width, tableWidth)
        }
    })

    const classes = useStyles()

    useEffect(() => {
        /* istanbul ignore else */
        if (props.initialSelectedItems?.length) {
            const initialSelected: { [uid: string]: boolean } = {}

            props.initialSelectedItems.forEach((item) => {
                const key = keyFn(item)
                initialSelected[key] = true
            })
            setSelected(initialSelected)
        }
    }, [props.initialSelectedItems])

    useLayoutEffect(() => {
        const newSelected: { [uid: string]: boolean } = {}
        /* istanbul ignore next */
        Object.keys(selected)
            .filter((key) => props.items?.find((item) => keyFn(item) === key))
            .forEach((key) => {
                newSelected[key] = selected[key]
            })
        setSelected(newSelected)
    }, [items])

    const { tableItems, totalCount } = useMemo<{
        tableItems: ITableItem<T>[]
        totalCount: number
    }>(() => {
        /* istanbul ignore if */
        if (!items) return { tableItems: [], totalCount: 0 }
        const tableItems = items.map((item) => {
            const key = keyFn(item)
            const group = (groupFn && groupFn(item)) || undefined
            const subRows = addSubRows?.(item)
            const tableItem: ITableItem<T> = { item, subRows, key, group }
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i]
                if (column.search) {
                    if (typeof column.search === 'string') {
                        tableItem[`column-${i}`] = get(item as unknown as Record<string, unknown>, column.search)
                    } else {
                        tableItem[`column-${i}`] = column.search(item)
                    }
                }
            }
            return tableItem
        })
        return { tableItems, totalCount: groupFn ? countGroups(tableItems) : tableItems.length }
    }, [items, columns, addSubRows, keyFn, groupFn])

    const { filtered, filteredCount } = useMemo<{
        filtered: ITableItem<T>[]
        filteredCount: number
    }>(() => {
        let threshold = 0.3
        if (props.fuseThreshold != undefined) {
            threshold = props.fuseThreshold
        }
        if (search && search !== '') {
            const fuse = new Fuse(tableItems, {
                ignoreLocation: true,
                threshold: threshold,
                keys: columns
                    .map((column, i) => (column.search ? `column-${i}` : undefined))
                    .filter((value) => value !== undefined) as string[],
                // TODO use FuseOptionKeyObject to allow for weights
            })
            const filtered = fuse.search<ITableItem<T>>(search).map((result) => result.item)
            return { filtered, filteredCount: groupFn ? countGroups(filtered) : filtered.length }
        } else {
            return { filtered: tableItems, filteredCount: totalCount }
        }
    }, [search, items, tableItems, totalCount, columns, groupFn])

    // Compensate for off-by-one error in sort column when all items are filtered out
    const adjustedSort =
        sort && sort.index && sort.direction && filtered.length === 0
            ? {
                  index: sort.index - adjustedSortIndexOffset,
                  direction: sort.direction,
              }
            : sort

    const sorted = useMemo<ITableItem<T>[]>(() => {
        if (sort && sort.index !== undefined) {
            const compare = columns[sort.index - sortIndexOffset].sort
            const sorted: ITableItem<T>[] = [...filtered]
            /* istanbul ignore else */
            if (compare) {
                if (typeof compare === 'string') {
                    sorted.sort(compareItems(`item.${compare}`))
                } else {
                    sorted.sort((a, b) => compare(a.item, b.item))
                }
            }
            if (sort.direction === SortByDirection.desc) {
                sorted.reverse()
            }
            return sorted
        } else {
            return filtered
        }
    }, [filtered, sort, columns])

    const { grouped, itemCount } = useMemo<{
        grouped: ITableItem<T>[]
        itemCount: number
    }>(() => {
        if (groupFn) {
            const grouped: ITableItem<T>[] = []
            const groupSubItems: { [key: string]: T[] } = {}
            sorted.forEach((tableItem) => {
                const { group, item } = tableItem
                if (group) {
                    tableItem.subItems = []
                    if (!groupSubItems[group]) {
                        groupSubItems[group] = tableItem.subItems
                        grouped.push(tableItem)
                    } else {
                        groupSubItems[group].push(item)
                    }
                } else {
                    grouped.push(tableItem)
                }
            })
            return { grouped, itemCount: grouped.length }
        } else {
            return { grouped: sorted, itemCount: sorted.length }
        }
    }, [sorted, columns, groupFn])

    const paged = useMemo<ITableItem<T>[]>(() => {
        let start = (page - 1) * perPage
        let actualPage = page
        if (start > grouped.length) {
            actualPage = Math.floor(grouped.length / perPage) + 1
            start = (actualPage - 1) * perPage
            setPage(actualPage)
        }
        return grouped.slice(start, start + perPage)
    }, [grouped, page, perPage])

    const rows = useMemo<IRow[]>(() => {
        const newRows: IRow[] = []
        const itemToCells = (item: T, key: string) =>
            columns.map((column) => {
                return typeof column.cell === 'string'
                    ? get(item as Record<string, unknown>, column.cell)
                    : { title: <Fragment key={key}>{column.cell(item)}</Fragment> }
            })
        let addedSubRows = 0
        paged.forEach((tableItem, i) => {
            const { item, key, group, subItems, subRows } = tableItem
            let isOpen: boolean | undefined = undefined
            if (group) {
                // Only expandable if the next item is also part of the group
                if (subItems!.length) {
                    isOpen = !!openGroups[group]
                }
            } else {
                isOpen = expanded[key] ?? (subRows?.length ? false : undefined)
            }
            // if there will be a group summary, include first item with the sub items
            const allSubItems =
                (group && groupSummaryFn && subItems && subItems!.length && [item].concat(subItems)) || subItems
            if (group && groupSummaryFn && allSubItems) {
                // if there are no sub items, pass in single item
                const groupSummary = groupSummaryFn(allSubItems.length ? allSubItems : [item])
                newRows.push({
                    ...groupSummary,
                    isOpen,
                    selected: selected[key] === true,
                    props: { key, group },
                })
            } else {
                newRows.push({
                    isOpen,
                    selected: selected[key] === true,
                    props: { key, group },
                    cells: itemToCells(item, key),
                })
            }
            if (allSubItems) {
                allSubItems.forEach((item) => {
                    const key = keyFn(item)
                    newRows.push({
                        parent: i + addedSubRows,
                        props: { key },
                        cells: itemToCells(item, key),
                    })
                })
                addedSubRows += allSubItems.length
            } else if (subRows) {
                subRows.forEach((subRow) => newRows.push({ ...subRow, parent: i + addedSubRows }))
                addedSubRows += subRows.length
            }
        })
        return newRows
    }, [selected, paged, columns, expanded, openGroups, keyFn])

    const onCollapse = useMemo<((_event: unknown, rowIndex: number, isOpen: boolean) => void) | undefined>(() => {
        if (groupFn) {
            return (_event, rowIndex, isOpen) => {
                const rowKey = rows[rowIndex].props.group.toString()
                setOpenGroups({ ...openGroups, [rowKey]: isOpen })
            }
        } else if (addSubRows) {
            return (_event, rowIndex, isOpen) => {
                const rowKey = rows[rowIndex].props.key.toString()
                setExpanded({ ...expanded, [rowKey]: isOpen })
            }
        }
        return undefined
    }, [rows, openGroups, setOpenGroups, expanded, setExpanded, groupFn, addSubRows])

    const updateSearch = useCallback(
        (newSearch: string) => {
            setSearch(newSearch)
            setPage(1)
            if (!newSearch) {
                // clearing filtered state; restore previous sorting if applicable
                if (preFilterSort) {
                    setSort(preFilterSort)
                }
            } else if (!search) {
                // entering a filtered state; save sort setting use fuzzy match sort
                setPreFilterSort(sort)
                setSort(undefined)
            }
        },
        // setSort/setSearch/setPage can come from props, but setPreFilterSort is only from state and therefore
        // guaranteed stable - not needed in dependency list
        [search, sort, preFilterSort, setSort, setSearch, setPage]
    )

    const updateSort = useCallback(
        (newSort: ISortBy) => {
            if (filtered.length === 0) {
                /* istanbul ignore next */
                setSort({
                    index: (newSort && newSort.index ? newSort.index : 0) + adjustedSortIndexOffset,
                    direction: newSort && newSort.direction,
                })
            } else {
                setSort(newSort)
            }
            if (search) {
                // sort changed while filtering; forget previous setting
                setPreFilterSort(undefined)
            }
        },
        [search, filtered]
    )

    const updatePerPage = useCallback(
        (newPerPage: number) => {
            // keep the first item in view on pagination size change
            const newPage = Math.floor(((page - 1) * perPage) / newPerPage) + 1
            setPage(newPage)
            setPerPage(newPerPage)
        },
        [page, perPage, setPage, setPerPage]
    )

    const onSelect = useCallback(
        (_event: FormEvent, isSelected: boolean, rowId: number) => {
            if (rowId === -1) {
                let allSelected = true
                for (const row of rows) {
                    if (!row.selected && row.parent === undefined) {
                        allSelected = false
                        break
                    }
                }
                const newSelected: { [uid: string]: boolean } = {}
                /* istanbul ignore else */
                if (!allSelected) {
                    for (const tableItem of filtered) {
                        newSelected[tableItem.key] = true
                    }
                }
                setSelected(newSelected)
                /* istanbul ignore next */
                if (props.onSelect && items) {
                    props.onSelect(items.filter((item) => newSelected[keyFn(item)]))
                }
            } else {
                const newSelected = { ...selected }
                if (isSelected) {
                    newSelected[rows[rowId].props.key] = true
                } else {
                    delete newSelected[rows[rowId].props.key]
                }
                setSelected(newSelected)
                /* istanbul ignore next */
                if (props.onSelect && items) {
                    props.onSelect(items.filter((item) => newSelected[keyFn(item)]))
                }
            }
        },
        [filtered, rows, keyFn]
    )

    // Function to parse provided actions from AcmTable IAcmRowAction --> Patternfly Table IAction
    const parseRowAction = (rowActions: IAcmRowAction<T>[]) => {
        const actions: IAction[] = []
        rowActions.forEach((action) => {
            // Add separator if specified
            if (action.addSeparator) {
                actions.push({
                    isSeparator: true,
                })
            }
            // Add row action with tooltip
            if (action.tooltip) {
                actions.push({
                    title: (
                        <Tooltip content={action.tooltip} zIndex={10001} position={'left'}>
                            <AcmButton
                                isDisabled={action.isDisabled}
                                variant={ButtonVariant.plain}
                                isInline={true}
                                className={'tooltiped-action-wrapper'}
                                style={{
                                    padding: 0,
                                    cursor: action.isDisabled ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {action.title}
                            </AcmButton>
                        </Tooltip>
                    ),
                    onClick: action.isDisabled
                        ? undefined
                        : (_event: React.MouseEvent, rowId: number, rowData: IRowData) => {
                              if (groupFn || addSubRows) {
                                  const tableItem =
                                      rowData.props?.key &&
                                      paged.find((tableItem) => tableItem.key === rowData.props.key)
                                  if (tableItem) {
                                      action.click(tableItem.item)
                                  }
                              } else {
                                  action.click(paged[rowId].item)
                              }
                          },
                })
            } else {
                // Add generic row action
                actions.push({
                    title: action.title,
                    isDisabled: action.isDisabled ? true : false,
                    onClick: (_event: React.MouseEvent, rowId: number, rowData: IRowData) => {
                        if (groupFn || addSubRows) {
                            const tableItem =
                                rowData.props?.key && paged.find((tableItem) => tableItem.key === rowData.props.key)
                            if (tableItem) {
                                action.click(tableItem.item)
                            }
                        } else {
                            action.click(paged[rowId].item)
                        }
                    },
                })
            }
        })
        return actions
    }

    // Parse static actions
    const actions = parseRowAction(rowActions)

    // Wrap provided action resolver
    let actionResolver: IActionsResolver | undefined
    if (rowActionResolver) {
        actionResolver = (rowData: IRowData, extraData: IExtraData) => {
            let tableItem
            if (groupFn || addSubRows) {
                tableItem = rowData.props?.key && paged.find((tableItem) => tableItem.key === rowData.props.key)
            } else {
                tableItem = paged[extraData.rowIndex!]
            }
            if (tableItem) {
                return parseRowAction(rowActionResolver(tableItem.item))
            }
            return []
        }
    }

    const hasSearch = useMemo(() => columns.some((column) => column.search), [columns])
    const hasItems = items && items.length > 0 && filtered
    const showToolbar = props.showToolbar !== false ? hasItems : false

    return (
        <Fragment>
            {props.extraToolbarControls && (
                <Toolbar style={{ paddingBottom: 0 }}>
                    <ToolbarContent>
                        <ToolbarGroup alignment={{ default: 'alignRight' }}>
                            <ToolbarItem>{props.extraToolbarControls}</ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>
            )}
            {showToolbar && (
                <Toolbar>
                    <ToolbarContent>
                        {hasSearch && (
                            <ToolbarGroup variant="filter-group">
                                <ToolbarItem variant="search-filter">
                                    <SearchInput
                                        placeholder={searchPlaceholder}
                                        value={search}
                                        onChange={updateSearch}
                                        onClear={() => updateSearch('')}
                                        resultsCount={`${filteredCount} / ${totalCount}`}
                                        style={{ flexGrow: 1 }}
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                        )}
                        {tableActions.length > 0 && (
                            <ToolbarGroup variant="button-group">
                                {tableActions.map((action) => (
                                    <ToolbarItem key={action.id}>
                                        <AcmButton
                                            onClick={action.click}
                                            isDisabled={action.isDisabled}
                                            tooltip={action.tooltip}
                                            variant={action.variant || ButtonVariant.primary}
                                        >
                                            {action.title}
                                        </AcmButton>
                                    </ToolbarItem>
                                ))}
                            </ToolbarGroup>
                        )}
                        {Object.keys(selected).length > 0 && bulkActions.length > 0 && (
                            <ToolbarGroup variant="button-group">
                                <ToolbarItem>
                                    <Dropdown
                                        // onSelect={this.onSelect}
                                        toggle={
                                            <DropdownToggle
                                                id="toggle-id"
                                                onToggle={() => setActionsOpen(!actionsOpen)}
                                                toggleIndicator={CaretDownIcon}
                                            >
                                                Actions
                                            </DropdownToggle>
                                        }
                                        isOpen={actionsOpen}
                                        dropdownItems={bulkActions.map((action) => (
                                            <DropdownItem
                                                key={action.id}
                                                onClick={() =>
                                                    action.click(items!.filter((item) => selected[keyFn(item)]))
                                                }
                                                isDisabled={action.isDisabled || Object.keys(selected).length === 0}
                                                tooltip={action.tooltip}
                                            >
                                                {action.title}
                                            </DropdownItem>
                                        ))}
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                        )}
                        {Object.keys(selected).length > 0 && (
                            <ToolbarGroup variant="button-group">
                                <ToolbarItem>{`${Object.keys(selected).length} selected`}</ToolbarItem>
                            </ToolbarGroup>
                        )}
                        {(!props.autoHidePagination || filtered.length > perPage) && (
                            <ToolbarItem variant="pagination">
                                <Pagination
                                    itemCount={itemCount}
                                    perPage={perPage}
                                    page={page}
                                    variant={PaginationVariant.top}
                                    onSetPage={(_event, page) => setPage(page)}
                                    onPerPageSelect={(_event, perPage) => updatePerPage(perPage)}
                                    aria-label="Pagination top"
                                    isCompact
                                />
                            </ToolbarItem>
                        )}
                    </ToolbarContent>
                </Toolbar>
            )}
            {!items || !rows || !filtered || !paged ? (
                <PageSection variant="light" padding={{ default: 'noPadding' }}>
                    <EmptyState>
                        <EmptyStateIcon variant="container" component={Spinner} />
                        <Title size="lg" headingLevel="h4">
                            Loading
                        </Title>
                    </EmptyState>
                </PageSection>
            ) : items.length === 0 ? (
                props.emptyState ? (
                    <PageSection variant="light" padding={{ default: 'noPadding' }}>
                        {props.emptyState}
                    </PageSection>
                ) : (
                    <PageSection variant="light" padding={{ default: 'noPadding' }}>
                        <AcmEmptyState
                            title={`No ${props.plural} found`}
                            message={`You do not have any ${props.plural} yet.`}
                        />
                    </PageSection>
                )
            ) : (
                <Fragment>
                    <div ref={outerDivRef} className={classes.outerDiv}>
                        <div ref={tableDivRef} className={classes.tableDiv}>
                            <Table
                                className={classes.table}
                                cells={columns.map((column) => {
                                    return {
                                        title: column.header,
                                        header: column.tooltip
                                            ? {
                                                  info: {
                                                      tooltip: column.tooltip,
                                                      tooltipProps: { isContentLeftAligned: true },
                                                  },
                                              }
                                            : {},
                                        transforms: [
                                            nowrap,
                                            ...(column.transforms || []),
                                            ...(column.sort ? [sortable] : []),
                                        ],
                                        cellTransforms: column.cellTransforms || [],
                                    }
                                })}
                                rows={rows}
                                rowWrapper={OuiaIdRowWrapper}
                                actionResolver={actionResolver}
                                actions={actions}
                                aria-label="Simple Table"
                                sortBy={adjustedSort}
                                onSort={(_event, index, direction) => updateSort({ index, direction })}
                                onSelect={
                                    /* istanbul ignore next */
                                    rows.length && (bulkActions?.length || !!props.onSelect) ? onSelect : undefined
                                }
                                onCollapse={onCollapse}
                                borders={!props.noBorders}
                                variant={TableVariant.compact}
                                gridBreakPoint={props.gridBreakPoint ?? breakpoint}
                            >
                                <TableHeader />
                                <TableBody />
                            </Table>
                        </div>
                    </div>
                    {!filtered.length && (
                        <PageSection variant="light" padding={{ default: 'noPadding' }}>
                            <AcmEmptyState
                                title="No results found"
                                message="No results match the filter criteria. Clear filters to show results."
                                showIcon={false}
                                action={
                                    <AcmButton variant="link" onClick={() => updateSearch('')}>
                                        Clear all filters
                                    </AcmButton>
                                }
                            />
                        </PageSection>
                    )}
                    {(!props.autoHidePagination || filtered.length > perPage) && (
                        <Pagination
                            itemCount={itemCount}
                            perPage={perPage}
                            page={page}
                            variant={PaginationVariant.bottom}
                            onSetPage={/* istanbul ignore next */ (_event, page) => setPage(page)}
                            onPerPageSelect={/* istanbul ignore next */ (_event, perPage) => updatePerPage(perPage)}
                            aria-label="Pagination bottom"
                        />
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export function compareItems(path: string) {
    return (a: unknown, b: unknown) => {
        return compareUnknowns(get(a as Record<string, unknown>, path), get(b as Record<string, unknown>, path))
    }
}

export function compareUnknowns(a: unknown | undefined | null, b: unknown | undefined | null) {
    /* istanbul ignore next */
    if (a == undefined && b == undefined) return 0
    /* istanbul ignore next */
    if (a == undefined) return 1
    /* istanbul ignore next */
    if (b == undefined) return -1

    /* istanbul ignore else */
    if (typeof a === 'string') {
        /* istanbul ignore else */
        if (typeof b === 'string') {
            return compareStrings(a, b)
        } else if (typeof b === 'number') {
            return compareStrings(a, b.toString())
        }
    } else if (typeof a === 'number') {
        /* istanbul ignore else */
        if (typeof b === 'number') {
            return compareNumbers(a, b)
        } else if (typeof b === 'string') {
            return compareStrings(a.toString(), b)
        }
    }
    /* istanbul ignore next */
    return 0
}

/* istanbul ignore next */
export function compareStrings(a: string | undefined | null, b: string | undefined | null) {
    if (a == undefined && b == undefined) return 0
    if (a == undefined) return 1
    if (b == undefined) return -1
    return a < b ? -1 : a > b ? 1 : 0
}

/* istanbul ignore next */
export function compareNumbers(a: number | undefined | null, b: number | undefined | null) {
    if (a == undefined && b == undefined) return 0
    if (a == undefined) return 1
    if (b == undefined) return -1
    return a < b ? -1 : a > b ? 1 : 0
}
