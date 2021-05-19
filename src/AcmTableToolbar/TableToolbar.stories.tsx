/* Copyright Contributors to the Open Cluster Management project */

import {
    Alert,
    AlertGroup,
    Bullseye,
    Button,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Hint,
    HintBody,
    HintFooter,
    HintTitle,
    Label,
    LabelGroup,
    Page,
    PageSection,
    Pagination,
    Stack,
    Title,
    Toolbar,
    ToolbarGroup,
    ToolbarItem,
} from '@patternfly/react-core'
import { Divider } from '@patternfly/react-core/src/components/Divider'
import { ICell, Table, TableBody, TableHeader } from '@patternfly/react-table'
import { Meta } from '@storybook/react'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { TableFilterProps } from './TableFilter'
import { TableToolbar } from './TableToolbar'
import { exampleData, IExampleData } from '../AcmTable/AcmTable.stories'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import { Collection } from './useCollection/collection'
import { useFilter, usePage, useSearch, useSelection, useSort } from './useCollection/useCollection'
import { cellFn, useRows } from './useCollection/useRows'

const meta: Meta = {
    title: 'TableToolbar',
    // component: AcmAutoRefreshSelect,
    argTypes: {
        Search: { control: { type: 'boolean' }, defaultValue: true },
        'Status Filter': { control: { type: 'boolean' }, defaultValue: true },
        'Risk Filter': { control: { type: 'boolean' }, defaultValue: true },
    },
}
export default meta

interface Example {
    name: string
    status: Status
    risk: Risk
}

enum Status {
    'New',
    'Pending',
    'Running',
    'Cancelled',
}
const statuses = Object.keys(Status).filter((k) => typeof Status[k as any] === 'number')

enum Risk {
    'Low',
    'Medium',
    'High',
}
const risks = Object.keys(Risk).filter((k) => typeof Risk[k as any] === 'number')

let render = 0

export const Table_Toolbar = (args: { Search: boolean; 'Status Filter': boolean; 'Risk Filter': boolean }) => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<string[]>([])
    const [risk, setRisk] = useState<string[]>([])

    const searchedCount = 100
    let filteredCount = 1000

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const [selectedCount, setSelectedCount] = useState(0)

    const filters: TableFilterProps[] = []
    if (args['Status Filter']) {
        filters.push({
            label: 'Status',
            selections: status,
            setSelections: setStatus,
            options: statuses,
        })
        filteredCount /= 2
    }

    if (args['Risk Filter']) {
        filters.push({ label: 'Risk', selections: risk, setSelections: setRisk, options: risks })
        filteredCount /= 2
    }

    const statusFilter = useCallback(
        (item: IExampleData) => {
            return !status.includes('New')
        },
        [status]
    )

    const [collection] = useState(new Collection<IExampleData>((item: IExampleData) => item.uid.toString(), 1000))
    useEffect(() => {
        collection.insert(exampleData)
    }, [])

    const [searchFn] = useState(() => (a) => 0)

    const [sortFn] = useState(() => (a, b) => {
        if (a.firstName < b.firstName) return -1
        if (a.firstName > b.firstName) return 1
        return 0
    })

    const selected = useSelection<IExampleData>(collection)
    const filtered = useFilter<IExampleData>(collection, statusFilter)
    const searched = useSearch<IExampleData>(filtered, searchFn)
    const sorted = useSort<IExampleData>(searched, sortFn)
    const paged = usePage<IExampleData>(sorted, page, perPage)
    const cells = useMemo<(ICell & { cellFn: cellFn<IExampleData> })[]>(
        () => [
            {
                title: 'First Name',
                cellFn: (item: IExampleData) => item.firstName,
            },
            {
                title: 'Last Name',
                cellFn: (item: IExampleData) => item.last_name,
            },
            {
                title: 'Gender',
                cellFn: (item: IExampleData) => item.gender,
            },
            {
                title: 'Email',
                cellFn: (item: IExampleData) => item.email,
            },
        ],
        []
    )
    const rows = useRows(
        paged,
        selected,
        cells.map((cell) => cell.cellFn)
    )

    useEffect(() => {
        const i = setInterval(() => {
            const items = collection.items()
            const index = Math.min(items.length - 1, Math.floor(Math.random() * items.length))
            const copy = { ...items[index] }
            copy.gender = Math.random().toString()
            collection.insert(copy)
        }, 100)
        return () => {
            clearInterval(i)
        }
    }, [collection])

    return (
        <Page>
            <PageSection>
                <Stack hasGutter>
                    <AlertGroup>
                        <Alert isInline variant="info" title="React Component">
                            Rendered {++render} times
                        </Alert>
                    </AlertGroup>
                    <LabelGroup defaultIsOpen numLabels={999}>
                        <Label variant="outline">{collection.items().length} items</Label>
                        <Label variant="outline">{selected.items().length} selected</Label>
                        <Label variant="outline">{filtered.items().length} filtered</Label>
                        <Label variant="outline">{searched.items().length} searched</Label>
                        <Label variant="outline">{sorted.items().length} sorted</Label>
                        <Label variant="outline">{paged.items().length} paged</Label>
                    </LabelGroup>
                    <Stack>
                        <TableToolbar
                            itemCount={filtered.items().length}
                            searchedCount={searchedCount}
                            filteredCount={filteredCount}
                            page={page}
                            perPage={perPage}
                            setPage={setPage}
                            setPerPage={setPerPage}
                            search={search}
                            setSearch={args.Search ? setSearch : undefined}
                            filters={filters}
                            selectedCount={selectedCount}
                            onSelectNone={() => selected.clear()}
                            onSelectPage={() => setSelectedCount(perPage)}
                            onSelectAll={() => selected.selectAll()}
                            selectionActions={[{ id: '1', children: 'Test' }]}
                            tableActions={[
                                { id: '1', children: 'Primary', isShared: true },
                                { id: '2', children: 'Secondary', isShared: true },
                                { id: '3', children: 'Action 3' },
                                { id: '4', children: 'Action 4' },
                            ]}
                            selectionBreakpoint={selectedCount ? 'sm' : 'sm'}
                            filtersBreakpoint={selectedCount ? 'lg' : 'md'}
                            actionsBreakpoint={selectedCount ? '2xl' : 'xl'}
                            paginationBreakpoint={selectedCount ? 'xl' : 'lg'}
                            paginationLargeBreakpoint={selectedCount ? 'never' : '2xl'}
                        />
                        {/* <Table
                            cells={columns}
                            rows={rows}
                            onSelect={() => {}}
                            canSelectAll={false}
                            actions={[
                                {
                                    title: 'actionResolver action',
                                    onClick: (event, rowId, rowData, extra) =>
                                        console.log(`clicked on Some action, on row ${rowId} of type ${rowData.type}`),
                                },
                                {
                                    title: <div>Another action</div>,
                                    onClick: (event, rowId, rowData, extra) =>
                                        console.log(
                                            `clicked on Another action, on row ${rowId} of type ${rowData.type}`
                                        ),
                                },
                            ]}
                            isStickyHeader
                        >
                            <TableHeader />
                            <TableBody />
                        </Table> */}
                        <Table
                            cells={cells}
                            rows={rows}
                            onSelect={(
                                event: React.FormEvent<HTMLInputElement>,
                                isSelected: boolean,
                                rowIndex: number
                                // rowData: IRowData,
                                // extraData: IExtraData
                            ) => {
                                if (rowIndex === -1) {
                                    selected.selectAll()
                                }
                            }}
                            canSelectAll={false}
                            isStickyHeader
                            variant="compact"
                        >
                            <TableHeader />
                            {rows.length > 0 && <TableBody />}
                        </Table>
                        {rows.length === 0 ? (
                            <PageSection variant="light" padding={{ default: 'noPadding' }} isFilled={false}>
                                <Bullseye>
                                    <EmptyState variant={EmptyStateVariant.small}>
                                        <EmptyStateIcon icon={SearchIcon} />
                                        <Title headingLevel="h2" size="lg">
                                            No results found
                                        </Title>
                                        <EmptyStateBody>
                                            <p>No results match the filter criteria.</p>
                                            <p>Remove filters or clear all filters to show results.</p>
                                        </EmptyStateBody>
                                    </EmptyState>
                                </Bullseye>
                            </PageSection>
                        ) : (
                            <Fragment>
                                <Divider />
                                <Pagination
                                    variant="bottom"
                                    itemCount={filtered.items().length}
                                    page={page}
                                    onSetPage={(_, page) => setPage(page)}
                                    perPage={perPage}
                                    onPerPageSelect={(_, perPage) => setPerPage(perPage)}
                                />
                            </Fragment>
                        )}
                    </Stack>
                    <Hint>
                        <HintTitle>Custom Change Tracking</HintTitle>
                        <HintBody>
                            <p>This uses custom hooks to track item changes.</p>
                            <p>Only renders the react component when an item affecting the current page changes.</p>
                            <p>
                                Filters, search, sorting and pagination are only applied to changes, making them very
                                efficient.
                            </p>
                        </HintBody>
                        <code>
                            <p>const collection = useCollection(items, debounce)</p>
                            <p>const selected = useSelection(collection)</p>
                            <p>const filtered = useFilter(collection, filterFn)</p>
                            <p>const searched = useSearch(filtered, searchFn)</p>
                            <p>const sorted = useSort(searched, searchFn)</p>
                            <p>const paged = usePage(sorted, page, perPage)</p>
                            <p>const rows = useRows(paged, selected, cells)</p>
                        </code>
                    </Hint>
                </Stack>
            </PageSection>
        </Page>
    )
}

// TableToolbar
//   TableSelection
//   TableToolbarFilterGroup
//     TableToolbarSearch
//     TableToolbarFilters
//     TablePaginationFilter
//   TableToolbarActions
//   TableToolbarPagination
