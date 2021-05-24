/* Copyright Contributors to the Open Cluster Management project */

import {
    Alert,
    AlertGroup,
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Hint,
    HintBody,
    HintTitle,
    Label,
    LabelGroup,
    Page,
    PageSection,
    Pagination,
    Progress,
    ProgressSize,
    Spinner,
    Stack,
    Text,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core'
import { Divider } from '@patternfly/react-core/src/components/Divider'
import SuccessIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon'
import ErrorIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon'
import ExclamationIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon'
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import { ICell, Table, TableBody, TableHeader } from '@patternfly/react-table'
import { Meta } from '@storybook/react'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { createTasks, Risk, risks, Status, statuses, Task, updateRandomTask } from './mocks/mock-addresses'
import { TableFilterProps } from './TableFilter'
import { TableToolbar } from './TableToolbar'
import { Collection } from './useCollection/collection'
import { useFilter, usePage, useSearch, useSelection, useSort } from './useCollection/useCollection'
import { cellFn, useRows } from './useCollection/useRows'
import { EnumSelect } from './EnumSelect'

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

enum UpdateTime {
    'Never' = 0,
    '1ms' = 1,
    '10ms' = 10,
    '100ms' = 100,
    '1000ms' = 1000,
}

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

    const [updateTime, setUpdateTime] = useState<UpdateTime>(UpdateTime.Never)

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
        (item: Task) => {
            return !status.includes('New')
        },
        [status]
    )

    const [collection] = useState(new Collection<Task>((item: Task) => item.id.toString(), 100))
    useEffect(() => {
        collection.insert(createTasks(1000))
    }, [])

    const [searchFn] = useState(() => (a) => 0)

    const [sortFn] = useState(() => (a, b) => {
        if (a.firstName < b.firstName) return -1
        if (a.firstName > b.firstName) return 1
        return 0
    })

    const selected = useSelection<Task>(collection)
    const filtered = useFilter<Task>(collection, statusFilter)
    const searched = useSearch<Task>(filtered, searchFn)
    const sorted = useSort<Task>(searched, sortFn)
    const paged = usePage<Task>(sorted, page, perPage)
    const cells = useMemo<(ICell & { cellFn: cellFn<Task> })[]>(
        () => [
            {
                title: 'Name',
                cellFn: (item: Task) => (
                    <Fragment>
                        <Text>Task {item.id}</Text>
                        <Text component="small">{item.name}</Text>
                    </Fragment>
                ),
            },
            {
                title: 'Status',
                cellFn: (item: Task) => (
                    <Fragment>
                        {item.progress === 100 ? (
                            <Fragment>
                                {item.status === Status.Complete ? (
                                    <Fragment>
                                        <SuccessIcon size="sm" color="var(--pf-global--success-color--100)" />
                                        &nbsp;&nbsp;
                                        {Status[item.status]}
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <ErrorIcon size="sm" color="var(--pf-global--danger-color--100)" />
                                        &nbsp;&nbsp;
                                        {Status[item.status]}
                                    </Fragment>
                                )}
                            </Fragment>
                        ) : item.progress === 0 ? (
                            <Fragment>
                                <PendingIcon size="sm" color="var(--pf-global--info-color--100)" />
                                &nbsp;&nbsp;
                                {Status[item.status]}
                            </Fragment>
                        ) : (
                            <Progress
                                value={item.progress}
                                isTitleTruncated
                                title={
                                    <Fragment>
                                        <Spinner size="sm" />
                                        &nbsp;&nbsp;
                                        {Status[item.status]}
                                    </Fragment>
                                }
                                size={ProgressSize.sm}
                            />
                        )}
                    </Fragment>
                ),
            },
            {
                title: 'Risk',
                cellFn: (item: Task) => (
                    <Fragment>
                        {item.risk === Risk.High ? (
                            <Fragment>
                                <ErrorIcon size="sm" color="var(--pf-global--danger-color--100)" /> &nbsp;
                                {Risk[item.risk]}
                            </Fragment>
                        ) : item.risk === Risk.Medium ? (
                            <Fragment>
                                <ExclamationIcon size="sm" color="var(--pf-global--warning-color--100)" /> &nbsp;
                                {Risk[item.risk]}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ExclamationIcon size="sm" color="var(--pf-global--info-color--100)" /> &nbsp;
                                {Risk[item.risk]}
                            </Fragment>
                        )}
                    </Fragment>
                ),
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
        if (updateTime === 0) return
        const interval = setInterval(() => {
            const updated = updateRandomTask(collection.items())
            collection.insert(updated)
        }, updateTime)
        return () => {
            clearInterval(interval)
        }
    }, [collection, updateTime])

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
                    <PageSection variant="light" padding={{ default: 'noPadding' }}>
                        {/* <Toolbar>
                            <ToolbarContent>
                                <ToolbarItem variant="label">Update random item every</ToolbarItem>
                                <ToolbarItem>
                                    <EnumSelect value={updateTime} anEnum={UpdateTime} onChange={setUpdateTime} />
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                        <Divider /> */}
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarItem variant="label">Update random item every</ToolbarItem>
                                <ToolbarItem>
                                    <EnumSelect value={updateTime} anEnum={UpdateTime} onChange={setUpdateTime} />
                                </ToolbarItem>
                            </ToolbarContent>
                        </Toolbar>
                    </PageSection>
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
