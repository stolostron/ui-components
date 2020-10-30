import {
    Button,
    Pagination,
    PaginationVariant,
    SearchInput,
    Split,
    SplitItem,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core'
import {
    IRow,
    ISortBy,
    sortable,
    SortByDirection,
    Table,
    TableBody,
    TableHeader,
    TableVariant,
} from '@patternfly/react-table'
import Fuse from 'fuse.js'
import get from 'get-value'
import React, { FormEvent, Fragment, ReactNode, useLayoutEffect, useState } from 'react'
import { AcmTableEmptyState, AcmTableEmptyStateProps } from './AcmTableEmptyState'

type SortFn<T> = (a: T, b: T) => number
type CellFn<T> = (item: T) => ReactNode
type SearchFn<T> = (item: T) => string | boolean | number | string[] | boolean[] | number[]

/* istanbul ignore next */
export interface IAcmTableColumn<T> {
    /** the header of the column */
    header: string

    /** enables sort either on field name of using sort function */
    sort?: SortFn<T> | string

    /** if defined will enable search of the search field */
    search?: SearchFn<T> | string

    /** cell content, either on field name of using cell function */
    cell: CellFn<T> | string
}

/* istanbul ignore next */
export interface IAcmTableAction {
    id: string
    title: string | React.ReactNode
    click: () => void
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
}

interface ISearchItem<T> {
    item: T
    [key: string]: unknown
}

export function AcmTable<T>(props: {
    plural: string
    items: T[]
    columns: IAcmTableColumn<T>[]
    keyFn: (item: T) => string
    tableActions: IAcmTableAction[]
    rowActions: IAcmRowAction<T>[]
    bulkActions: IAcmTableBulkAction<T>[]
    extraToolbarControls?: ReactNode
    emptyState: AcmTableEmptyStateProps
}) {
    const { items, columns, keyFn } = props
    const [hasSearch, setHasSearch] = useState(true)
    const [searchItems, setSearchItems] = useState<ISearchItem<T>[]>()
    const [filtered, setFiltered] = useState<T[]>(items)
    const [sorted, setSorted] = useState<T[]>()
    const [paged, setPaged] = useState<T[]>()
    const [rows, setRows] = useState<IRow[] | undefined>([])
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<ISortBy | undefined>({ index: 1, direction: SortByDirection.asc })
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [selected, setSelected] = useState<{ [uid: string]: boolean }>({})

    useLayoutEffect(() => {
        setHasSearch(columns.some((column) => column.search))
    }, [columns])

    useLayoutEffect(() => {
        const newSelected: { [uid: string]: boolean } = {}
        /* istanbul ignore next */
        Object.keys(selected)
            .filter((key) => props.items.find((item) => keyFn(item) === key))
            .forEach((key) => {
                newSelected[key] = selected[key]
            })
        setSelected(newSelected)
    }, [items])

    useLayoutEffect(() => {
        setSearchItems(
            items.map((item) => {
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
        )
    }, [items, columns])

    useLayoutEffect(() => {
        if (search && search !== '' && searchItems) {
            const fuse = new Fuse(searchItems, {
                includeScore: true,
                threshold: 0.2,
                keys: columns
                    .map((column, i) => (column.search ? `column-${i}` : undefined))
                    .filter((value) => value !== undefined) as string[],
                // TODO use FuseOptionKeyObject to allow for weights
            })
            setFiltered(fuse.search(search).map((result) => result.item.item))
            setSort(undefined)
        } else {
            setFiltered(items)
        }
    }, [search, items, searchItems, columns])

    useLayoutEffect(() => {
        if (sort && sort.index && filtered) {
            const compare = columns[sort.index - 1].sort
            let sorted: T[] = [...filtered]
            /* istanbul ignore else */
            if (compare) {
                if (typeof compare === 'string') {
                    sorted = [...filtered].sort(compareItems(compare))
                } else {
                    sorted = [...filtered].sort(compare)
                }
            }
            sorted = sort.direction === SortByDirection.asc ? sorted : sorted.reverse()
            setSorted(sorted)
        } else {
            setSorted(filtered)
        }
    }, [filtered, sort, columns])

    useLayoutEffect(() => {
        const start = (page - 1) * perPage
        if (start >= 0 && sorted && sorted.length > perPage) {
            let paged = [...sorted]
            if (start !== 0) {
                /* istanbul ignore if */
                if (start >= paged.length) {
                    setPage(page - 1)
                } else {
                    paged = paged.slice(start)
                }
            }
            /* istanbul ignore else */
            if (paged.length > perPage) {
                paged = paged.slice(0, perPage)
            }
            setPaged(paged)
        } else {
            setPaged(sorted)
        }
    }, [sorted, page, perPage])

    useLayoutEffect(() => {
        if (paged) {
            const newRows = paged.map((item) => {
                return {
                    selected: selected[keyFn(item)] === true,
                    props: { key: keyFn(item) },
                    cells: columns.map((column) => {
                        return (
                            <Fragment key={keyFn(item)}>
                                {typeof column.cell === 'string'
                                    ? get(item as Record<string, unknown>, column.cell)
                                    : column.cell(item)}
                            </Fragment>
                        )
                    }),
                }
            })
            setRows(newRows)
        } else {
            setRows(undefined)
        }
    }, [selected, paged, keyFn, columns])

    function onSelect(_event: FormEvent, isSelected: boolean, rowId: number) {
        /* istanbul ignore next */
        if (!paged) return
        /* istanbul ignore next */
        if (!filtered) return
        /* istanbul ignore next */
        if (!rows) return
        if (rowId === -1) {
            let allSelected = true
            for (const row of rows) {
                if (!row.selected) {
                    allSelected = false
                    break
                }
            }
            const newSelected: { [uid: string]: boolean } = {}
            if (!allSelected) {
                for (const item of filtered) {
                    newSelected[keyFn(item)] = true
                }
            }
            setSelected(newSelected)
        } else {
            const newSelected = { ...selected }
            if (isSelected) {
                newSelected[keyFn(paged[rowId])] = true
            } else {
                delete newSelected[keyFn(paged[rowId])]
            }
            setSelected(newSelected)
        }
    }

    const actions = props.rowActions.map((rowAction) => {
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

    if (!rows) {
        return <Fragment />
    }

    return (
        <Fragment>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarItem hidden={!hasSearch}>
                        <SearchInput
                            style={{ minWidth: '350px' }}
                            placeholder="Search"
                            value={search}
                            onChange={(value) => {
                                setSearch(value)
                                if (value === '') {
                                    /* istanbul ignore next */
                                    if (!sort) {
                                        setSort({ index: 1, direction: SortByDirection.asc })
                                    }
                                }
                            }}
                            onClear={() => {
                                setSearch('')
                                setSort({ index: 1, direction: SortByDirection.asc })
                            }}
                            resultsCount={`${filtered.length} / ${items.length}`}
                        />
                    </ToolbarItem>
                    <ToolbarItem alignment={{ default: 'alignRight' }} />
                    {Object.keys(selected).length ? (
                        <Fragment>
                            <ToolbarItem>
                                {Object.keys(selected).length}/{props.items.length} {props.plural} selected
                            </ToolbarItem>
                            <ToolbarItem variant="separator" />
                            {props.bulkActions.map((action) => (
                                <ToolbarItem key={action.id}>
                                    <Button
                                        onClick={() => {
                                            action.click(props.items.filter((item) => selected[keyFn(item)]))
                                        }}
                                    >
                                        {action.title}
                                    </Button>
                                </ToolbarItem>
                            ))}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {props.tableActions.map((action) => (
                                <ToolbarItem key={action.id}>
                                    <Button
                                        onClick={() => {
                                            action.click()
                                        }}
                                    >
                                        {action.title}
                                    </Button>
                                </ToolbarItem>
                            ))}
                        </Fragment>
                    )}
                    {props.extraToolbarControls}
                </ToolbarContent>
            </Toolbar>
            <Table
                cells={columns.map((column) => {
                    return {
                        title: column.header,
                        transforms: column.sort ? [sortable] : undefined,
                    }
                })}
                rows={rows}
                actions={actions}
                canSelectAll={true}
                aria-label="Simple Table"
                sortBy={sort}
                onSort={(_event, index, direction) => {
                    setSort({ index, direction })
                }}
                onSelect={onSelect}
                variant={TableVariant.compact}
            >
                <TableHeader />
                <TableBody />
            </Table>
            {rows.length === 0 && (
                <AcmTableEmptyState
                    title={props.emptyState.title}
                    message={props.emptyState.message}
                    action={props.emptyState.action}
                />
            )}
            {rows.length > 0 && (
                <Split>
                    <SplitItem isFilled>
                        <Toolbar>
                            {/* <ToolbarContent>
                            <ToolbarItem>
                                <ToggleGroup>
                                    <ToggleGroupItem key={0} buttonId="first" isSelected={true}>
                                        Compact
                                    </ToggleGroupItem>
                                    <ToggleGroupItem key={0} buttonId="first" isSelected={false}>
                                        Compact
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </ToolbarItem>
                        </ToolbarContent> */}
                        </Toolbar>
                    </SplitItem>
                    <SplitItem>
                        <Pagination
                            hidden={filtered.length < perPage}
                            itemCount={filtered.length}
                            perPage={perPage}
                            page={page}
                            variant={PaginationVariant.bottom}
                            onSetPage={(_event, page) => {
                                setPage(page)
                            }}
                            onPerPageSelect={(_event, perPage) => {
                                setPerPage(perPage)
                            }}
                        ></Pagination>
                    </SplitItem>
                </Split>
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
