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

type SortFn<T> = (a: T, b: T) => number
type CellFn<T> = (item: T) => ReactNode

export interface IAcmTableColumn<T> {
    /** the header of the column */
    header: string

    /** enables sort either on field name of using sort function */
    sort?: SortFn<T> | string

    /** if defined will enable search of the search field */
    search?: string

    /** cell content, either on field name of using cell function */
    cell: CellFn<T> | string
}

export interface IAcmTableAction {
    id: string
    title: string | React.ReactNode
    click: () => void
}

export interface IAcmRowAction<T> {
    id: string
    title: string | React.ReactNode
    click: (item: T) => void
}

export interface IAcmTableBulkAction<T> {
    id: string
    title: string | React.ReactNode
    click: (items: T[]) => void
}

export function AcmTable<T>(props: {
    plural: string
    items: T[]
    columns: IAcmTableColumn<T>[]
    keyFn: (item: T) => string
    tableActions: IAcmTableAction[]
    rowActions: IAcmRowAction<T>[]
    bulkActions: IAcmTableBulkAction<T>[]
}) {
    const { items, columns, keyFn } = props
    const [filtered, setFiltered] = useState<T[]>(props.items)
    const [sorted, setSorted] = useState<T[]>()
    const [paged, setPaged] = useState<T[]>()
    const [rows, setRows] = useState<IRow[] | undefined>([])
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<ISortBy | undefined>({ index: 1, direction: SortByDirection.asc })
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [selected, setSelected] = useState<{ [uid: string]: boolean }>({})

    useLayoutEffect(() => {
        if (search && search !== '') {
            const fuse = new Fuse(items, {
                includeScore: true,
                threshold: 0.2,
                keys: columns.map((column) => column.search).filter((value) => value !== undefined) as string[],
            })
            setFiltered(fuse.search(search).map((result) => result.item))
            setSort(undefined)
        } else {
            setFiltered(items)
        }
    }, [search, items, columns])

    useLayoutEffect(() => {
        if (sort && sort.index && filtered) {
            const compare = columns[sort.index - 1].sort
            let sorted: T[] = [...filtered]
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
                if (start >= paged.length) {
                    setPage(page - 1)
                } else {
                    paged = paged.slice(start)
                }
            }
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
        if (!paged) return
        if (!filtered) return
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
                if (paged) {
                    rowAction.click(paged[rowId])
                }
            },
        }
    })

    if (!rows) {
        return <></>
    }

    return (
        <Fragment>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarItem>
                        <SearchInput
                            style={{ minWidth: '350px' }}
                            placeholder="Search"
                            value={search}
                            onChange={(value) => {
                                setSearch(value)
                                if (value === '') {
                                    if (!sort) {
                                        setSort({ index: 1, direction: SortByDirection.asc })
                                    }
                                }
                            }}
                            onClear={() => {
                                setSearch('')
                                setSort({ index: 1, direction: SortByDirection.asc })
                            }}
                            resultsCount={`${filtered?.length} / ${items.length}`}
                        />
                    </ToolbarItem>
                    <ToolbarItem alignment={{ default: 'alignRight' }}></ToolbarItem>
                    {Object.keys(selected).length ? (
                        <Fragment>
                            <ToolbarItem>
                                {Object.keys(selected).length}/{props.items.length} {props.plural} selected
                            </ToolbarItem>
                            <ToolbarItem variant="separator"></ToolbarItem>
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
                        itemCount={filtered ? filtered.length : 0}
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
        </Fragment>
    )
}

export function compareItems(path: string) {
    return (a: unknown, b: unknown) => {
        return compareUnknowns(get(a as Record<string, unknown>, path), get(b as Record<string, unknown>, path))
    }
}

export function compareUnknowns(a: unknown | undefined | null, b: unknown | undefined | null) {
    if (a == undefined && b == undefined) return 0
    if (a == undefined) return 1
    if (b == undefined) return -1
    if (typeof a === 'string') {
        if (typeof b === 'string') {
            return compareStrings(a, b)
        } else if (typeof b === 'number') {
            return compareStrings(a, b.toString())
        }
    } else if (typeof a === 'number') {
        if (typeof b === 'string') {
            return compareStrings(a.toString(), b)
        } else if (typeof b === 'number') {
            return compareNumbers(a, b)
        }
    }
    return 0
}

export function compareStrings(a: string | undefined | null, b: string | undefined | null) {
    if (a == undefined && b == undefined) return 0
    if (a == undefined) return 1
    if (b == undefined) return -1
    return a < b ? -1 : a > b ? 1 : 0
}

export function compareNumbers(a: number | undefined | null, b: number | undefined | null) {
    if (a == undefined && b == undefined) return 0
    if (a == undefined) return 1
    if (b == undefined) return -1
    return a < b ? -1 : a > b ? 1 : 0
}
