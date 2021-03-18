/* Copyright Contributors to the Open Cluster Management project */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Grow } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import {
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownToggleCheckbox,
    EmptyState,
    EmptyStateIcon,
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
} from '@patternfly/react-core'
import {
    IRow,
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
}

/* istanbul ignore next */
export interface IAcmRowAction<T> {
    id: string
    title: string | React.ReactNode
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

interface ISearchItem<T> {
    item: T
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
})

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
    columns: IAcmTableColumn<T>[]
    keyFn: (item: T) => string
    tableActions?: IAcmTableAction[]
    rowActions?: IAcmRowAction<T>[]
    bulkActions?: IAcmTableBulkAction<T>[]
    extraToolbarControls?: ReactNode
    emptyState?: ReactNode
    onSelect?: (items: T[]) => void
    page?: number
    setPage?: (page: number) => void
    search?: string
    setSearch?: (search: string) => void
    sort?: ISortBy | undefined
    setSort?: (sort: ISortBy | undefined) => void
    gridBreakPoint?: TableGridBreakpoint
    perPageOptions?: PerPageOptions[]
    autoHidePagination?: boolean
}
export function AcmTable<T>(props: AcmTableProps<T>) {
    const { items, columns, keyFn, bulkActions = [], rowActions = [], tableActions = [] } = props
    const sortIndexOffset = bulkActions && bulkActions.length ? 1 : 0
    const [selected, setSelected] = useState<{ [uid: string]: boolean }>({})
    const [selectionOpen, setSelectionOpen] = useState(false)

    const defaultSort = {
        index: sortIndexOffset,
        direction: SortByDirection.asc,
    }

    // State that can come from context or component state (perPage)
    const [statePerPage, stateSetPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)
    const { perPage: contextPerPage, setPerPage: contextSetPerPage } = useContext(AcmTablePaginationContext)
    const perPage = contextPerPage || statePerPage
    const setPerPage = contextSetPerPage || stateSetPerPage

    // State that can come from component props or from component state (page, search, sort)
    const [statePage, stateSetPage] = useState(1)
    const page = props.page || statePage
    const setPage = props.setPage || stateSetPage
    const [stateSearch, stateSetSearch] = useState('')
    const search = props.search || stateSearch
    const setSearch = props.setSearch || stateSetSearch
    const [stateSort, stateSetSort] = useState<ISortBy | undefined>(defaultSort)
    const sort = props.sort || stateSort
    const setSort = props.setSort || stateSetSort

    // Nice to have, but disposable state (preFilterSort)
    const [preFilterSort, setPreFilterSort] = useState<ISortBy | undefined>(defaultSort)

    const hasSearch = useMemo(() => columns.some((column) => column.search), [columns])

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
            // table needs to switch to grid; make the change and record viewport size when this happened
            const newBreakpoint =
                BREAKPOINT_SIZES.find((b) => viewportWidth <= b.size)?.name || TableGridBreakpoint.none
            setBreakpoint(newBreakpoint)
            setExactBreakpoint(viewportWidth)
        } else if (exactBreakpoint && viewportWidth > exactBreakpoint) {
            // viewport is now bigger than when we last switched to grid; try bigger breakpoint, which will
            // be reverted in the layout effect if the table is still too wide
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
        // Need to check on every update to breakpoint as well for the same case, to that display
        // doesn't thrash between table/grid on intial expansion of viewport
        [breakpoint, outerDiv, tableDiv]
    )

    /* istanbul ignore next */
    useResizeObserver(outerDiv, (entry) => {
        if (!props.gridBreakPoint && entry.contentRect && tableDiv) {
            const width = Math.floor(entry.contentRect.width)
            const tableWidth = tableDiv.clientWidth
            updateBreakpoint(width, tableWidth)
        }
    })

    const classes = useStyles()

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

    const searchItems = useMemo<ISearchItem<T>[]>(() => {
        /* istanbul ignore if */
        if (!items) return []
        return items.map((item) => {
            const searchItem: ISearchItem<T> = { item: item }
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i]
                if (column.search) {
                    if (typeof column.search === 'string') {
                        searchItem[`column-${i}`] = get((item as unknown) as Record<string, unknown>, column.search)
                    } else {
                        searchItem[`column-${i}`] = column.search(item)
                    }
                }
            }
            return searchItem
        })
    }, [items, columns])

    const filtered = useMemo<T[]>(() => {
        if (search && search !== '' && searchItems) {
            const fuse = new Fuse(searchItems, {
                threshold: 0.3,
                keys: columns
                    .map((column, i) => (column.search ? `column-${i}` : undefined))
                    .filter((value) => value !== undefined) as string[],
                // TODO use FuseOptionKeyObject to allow for weights
            })
            return fuse.search<ISearchItem<T>>(search).map((result) => result.item.item)
        } else {
            return items || []
        }
    }, [search, items, searchItems, columns])

    // Compensate for off-by-one error in sort column when all items are filtered out
    const adjustedSort =
        sort && sort.index && sort.direction && filtered.length === 0
            ? {
                  index: sort.index - sortIndexOffset,
                  direction: sort.direction,
              }
            : sort

    const sorted = useMemo<T[]>(() => {
        if (sort && sort.index !== undefined) {
            const compare = columns[sort.index - sortIndexOffset].sort
            const sorted: T[] = [...filtered]
            /* istanbul ignore else */
            if (compare) {
                if (typeof compare === 'string') {
                    sorted.sort(compareItems(compare))
                } else {
                    sorted.sort(compare)
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

    const paged = useMemo<T[]>(() => {
        let start = (page - 1) * perPage
        let actualPage = page
        if (start > sorted.length) {
            actualPage = Math.floor(sorted.length / perPage) + 1
            start = (actualPage - 1) * perPage
            setPage(actualPage)
        }
        return sorted.slice(start, start + perPage)
    }, [sorted, page, perPage])

    const rows = useMemo<IRow[] | undefined>(() => {
        const newRows = paged.map((item) => {
            const key = keyFn(item)
            return {
                selected: selected[key] === true,
                props: { key },
                cells: columns.map((column) => {
                    return typeof column.cell === 'string' ? (
                        get(item as Record<string, unknown>, column.cell)
                    ) : (
                        <Fragment key={key}>{column.cell(item)}</Fragment>
                    )
                }),
            }
        })
        return newRows
    }, [selected, paged, keyFn, columns])

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
                    index: (newSort && newSort.index ? newSort.index : 0) + sortIndexOffset,
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
            /* istanbul ignore next */
            if (!paged) return
            /* istanbul ignore next */
            if (!filtered) return
            /* istanbul ignore next */
            if (!rows) return

            // Ignoring the if here because the table no longer usees header select all
            // but leaving in case we want to reenable it
            /* istanbul ignore if */
            if (rowId === -1) {
                let allSelected = true
                for (const row of rows) {
                    if (!row.selected) {
                        allSelected = false
                        break
                    }
                }
                const newSelected: { [uid: string]: boolean } = {}
                /* istanbul ignore else */
                if (!allSelected) {
                    for (const item of filtered) {
                        newSelected[keyFn(item)] = true
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
                    newSelected[keyFn(paged[rowId])] = true
                } else {
                    delete newSelected[keyFn(paged[rowId])]
                }
                setSelected(newSelected)
                /* istanbul ignore next */
                if (props.onSelect && items) {
                    props.onSelect(items.filter((item) => newSelected[keyFn(item)]))
                }
            }
        },
        [paged, filtered, rows, keyFn]
    )

    const actions = rowActions.map((rowAction) => {
        return {
            title: rowAction.title,
            onClick: (_event: React.MouseEvent, rowId: number) => {
                /* istanbul ignore else */
                if (paged) {
                    rowAction.click(paged[rowId])
                }
            },
        }
    })

    const hasItems = items && items.length > 0 && filtered
    const hasTableActions = tableActions && tableActions.length > 0
    const hasBulkActions = bulkActions && bulkActions.length > 0
    const includeBulkToolbar = hasBulkActions || props.extraToolbarControls
    const showToolbar = (hasItems && hasSearch) || props.extraToolbarControls

    return (
        <Fragment>
            {showToolbar && (
                <Toolbar inset={{ default: 'insetNone' }} style={{ paddingTop: 0 }}>
                    <ToolbarContent>
                        {hasItems && hasSearch && (
                            <ToolbarGroup style={{ flexGrow: 1 }} variant="filter-group">
                                <ToolbarItem variant="search-filter" style={{ flexGrow: 1 }}>
                                    <SearchInput
                                        placeholder="Search"
                                        value={search}
                                        onChange={updateSearch}
                                        onClear={() => updateSearch('')}
                                        resultsCount={`${filtered!.length} / ${items!.length}`}
                                        style={{ flexGrow: 1 }}
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                        )}
                        <ToolbarItem alignment={{ default: 'alignRight' }} />
                        {hasItems && hasTableActions && (
                            <ToolbarGroup variant="button-group">
                                {tableActions.map((action) => (
                                    <ToolbarItem key={action.id}>
                                        <AcmButton
                                            onClick={action.click}
                                            isDisabled={action.isDisabled}
                                            tooltip={action.tooltip}
                                        >
                                            {action.title}
                                        </AcmButton>
                                    </ToolbarItem>
                                ))}
                            </ToolbarGroup>
                        )}
                        {props.extraToolbarControls && <ToolbarGroup>{props.extraToolbarControls}</ToolbarGroup>}
                        {!includeBulkToolbar && hasItems && (!props.autoHidePagination || filtered.length > perPage) && (
                            <ToolbarGroup>
                                <ToolbarItem>
                                    <Pagination
                                        itemCount={filtered.length}
                                        perPage={perPage}
                                        page={page}
                                        variant={PaginationVariant.top}
                                        onSetPage={(_event, page) => setPage(page)}
                                        onPerPageSelect={(_event, perPage) => updatePerPage(perPage)}
                                        isCompact
                                        style={{ paddingRight: 0 }}
                                        aria-label="Pagination top"
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                        )}
                    </ToolbarContent>
                </Toolbar>
            )}
            {items && hasItems && includeBulkToolbar && (
                <Toolbar inset={{ default: 'insetNone' }} style={{ paddingTop: 0, paddingBottom: '12px' }}>
                    <ToolbarContent>
                        {hasBulkActions && (
                            <Fragment>
                                <ToolbarGroup variant="button-group">
                                    <ToolbarItem>
                                        <Dropdown
                                            toggle={
                                                <DropdownToggle
                                                    splitButtonItems={[
                                                        <DropdownToggleCheckbox
                                                            id="example-checkbox-2"
                                                            key="split-checkbox"
                                                            aria-label="Select all"
                                                            isChecked={Object.keys(selected).length > 0}
                                                            onChange={() => {
                                                                if (Object.keys(selected).length > 0) {
                                                                    setSelected({})
                                                                } else {
                                                                    setSelected(
                                                                        items!.reduce((selection, item) => {
                                                                            selection[keyFn(item)] = true
                                                                            return selection
                                                                        }, {} as Record<string, boolean>)
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            {Object.keys(selected).length > 0
                                                                ? `${Object.keys(selected).length} selected`
                                                                : ''}
                                                        </DropdownToggleCheckbox>,
                                                    ]}
                                                    onToggle={(isOpen) => setSelectionOpen(isOpen)}
                                                />
                                            }
                                            isOpen={selectionOpen}
                                            dropdownItems={[
                                                <DropdownItem
                                                    key="none"
                                                    onClick={() => {
                                                        setSelected({})
                                                        setSelectionOpen(false)
                                                    }}
                                                >
                                                    Select none (0 items)
                                                </DropdownItem>,
                                                <DropdownItem
                                                    key="page"
                                                    onClick={() => {
                                                        setSelected(
                                                            paged.reduce((selection, item) => {
                                                                selection[keyFn(item)] = true
                                                                return selection
                                                            }, {} as Record<string, boolean>)
                                                        )
                                                        setSelectionOpen(false)
                                                    }}
                                                >{`Select page (${perPage} items)`}</DropdownItem>,
                                                <DropdownItem
                                                    key="all"
                                                    onClick={() => {
                                                        setSelected(
                                                            items!.reduce((selection, item) => {
                                                                selection[keyFn(item)] = true
                                                                return selection
                                                            }, {} as Record<string, boolean>)
                                                        )
                                                        setSelectionOpen(false)
                                                    }}
                                                >{`Select all (${items.length} items)`}</DropdownItem>,
                                            ]}
                                        />
                                    </ToolbarItem>
                                </ToolbarGroup>
                                {Object.keys(selected).length !== 0 && (
                                    <ToolbarGroup variant="button-group">
                                        {bulkActions.map((action) => (
                                            <ToolbarItem key={action.id}>
                                                <Grow in={true}>
                                                    <AcmButton
                                                        onClick={() =>
                                                            action.click(items!.filter((item) => selected[keyFn(item)]))
                                                        }
                                                        isDisabled={action.isDisabled}
                                                        tooltip={action.tooltip}
                                                    >
                                                        {action.title}
                                                    </AcmButton>
                                                </Grow>
                                            </ToolbarItem>
                                        ))}
                                    </ToolbarGroup>
                                )}
                            </Fragment>
                        )}
                        <ToolbarItem alignment={{ default: 'alignRight' }} />
                        {
                            // ignoring as the pagination above is used in tests
                            /* istanbul ignore next */
                            (!props.autoHidePagination || filtered.length > perPage) && (
                                <ToolbarGroup>
                                    <ToolbarItem>
                                        <Pagination
                                            itemCount={filtered.length}
                                            perPage={perPage}
                                            page={page}
                                            variant={PaginationVariant.top}
                                            onSetPage={(_event, page) => setPage(page)}
                                            onPerPageSelect={(_event, perPage) => updatePerPage(perPage)}
                                            isCompact
                                            style={{ paddingRight: 0 }}
                                            aria-label="Pagination top"
                                        />
                                    </ToolbarItem>
                                </ToolbarGroup>
                            )
                        }
                    </ToolbarContent>
                </Toolbar>
            )}
            {!items || !rows || !filtered || !paged ? (
                <EmptyState>
                    <EmptyStateIcon variant="container" component={Spinner} />
                    <Title size="lg" headingLevel="h4">
                        Loading
                    </Title>
                </EmptyState>
            ) : items.length === 0 ? (
                props.emptyState ? (
                    props.emptyState
                ) : (
                    <AcmEmptyState
                        title={`No ${props.plural} found`}
                        message={`You do not have any ${props.plural} yet.`}
                    />
                )
            ) : (
                <Fragment>
                    <div ref={outerDivRef} className={classes.outerDiv}>
                        <div ref={tableDivRef} className={classes.tableDiv}>
                            <Table
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
                                actions={actions}
                                canSelectAll={false}
                                aria-label="Simple Table"
                                sortBy={adjustedSort}
                                onSort={(_event, index, direction) => updateSort({ index, direction })}
                                onSelect={
                                    /* istanbul ignore next */
                                    rows.length && bulkActions?.length ? onSelect : undefined
                                }
                                variant={TableVariant.compact}
                                gridBreakPoint={props.gridBreakPoint ?? breakpoint}
                            >
                                <TableHeader />
                                <TableBody />
                            </Table>
                        </div>
                    </div>
                    {
                        // ignoring as the pagination at the top of the table is used in tests
                        /* istanbul ignore next */
                        filtered.length !== 0 && (!props.autoHidePagination || filtered.length > perPage) && (
                            <Pagination
                                itemCount={filtered.length}
                                perPage={perPage}
                                page={page}
                                variant={PaginationVariant.bottom}
                                onSetPage={(_event, page) => setPage(page)}
                                onPerPageSelect={(_event, perPage) => updatePerPage(perPage)}
                                perPageOptions={props.perPageOptions}
                                style={{ paddingRight: 0, paddingBottom: 0 }}
                            />
                        )
                    }
                    {!filtered.length && (
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
