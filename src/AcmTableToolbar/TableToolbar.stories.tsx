/* eslint-disable react/display-name */
/* Copyright Contributors to the Open Cluster Management project */

import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
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
import SuccessIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon'
import ErrorIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon'
import ExclamationIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon'
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon'
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon'
import { ICell, Table, TableBody, TableHeader } from '@patternfly/react-table'
import { Meta } from '@storybook/react'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useCollectionCount } from './collections/collection'
import { useFilteredCollection } from './collections/filtered-collection'
import { usePagedCollection } from './collections/paged-collection'
import { useSearchedCollection } from './collections/searched-collection'
import { useSelectedCollection } from './collections/selected-collection'
import { useSortedCollection } from './collections/sorted-collection'
import { EnumSelect } from './EnumSelect'
import { Risk, risks, Status, statuses, Task, updateRandomTask, useMockTasks } from './mocks/mock-tasks'
import { TableFilterProps } from './TableFilter'
import { TableToolbar } from './TableToolbar'
import { cellFn, useRows } from './useCollection/useRows'
import Fuse from 'fuse.js'

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
    const [updateTime, setUpdateTime] = useState<UpdateTime>(UpdateTime.Never)
    const collection = useMockTasks(100000, 100)
    const collectionCount = useCollectionCount(collection)

    const [statusFilter, setStatusFilter] = useState<Status[]>([])
    const [riskFilter, setRiskFilter] = useState<Risk[]>([])
    const filterFn = useCallback(
        (item: Task) => {
            if (statusFilter.length > 0 && !statusFilter.includes(item.status)) return false
            if (riskFilter.length > 0 && !riskFilter.includes(item.risk)) return false
            return true
        },
        [statusFilter, riskFilter]
    )
    const filters = useMemo<TableFilterProps[]>(() => {
        return [
            {
                label: 'Status',
                selections: statusFilter,
                setSelections: setStatusFilter,
                options: statuses,
            },
            {
                label: 'Risk',
                selections: riskFilter,
                setSelections: setRiskFilter,
                options: risks,
            },
        ]
    }, [statusFilter, riskFilter])
    const filtered = useFilteredCollection<Task>(collection, filterFn)
    const filteredCount = useCollectionCount(filtered)

    const [search, setSearch] = useState('')
    const [searchOptions] = useState<Fuse.IFuseOptions<Task>>({
        keys: [
            { name: 'name', weight: 1 },
            { name: 'description', weight: 0.5 },
        ],
        shouldSort: true,
    })
    const searched = useSearchedCollection<Task>(filtered, search, searchOptions)
    const searchedCount = useCollectionCount(searched)

    const [sortFn] = useState(() => (a, b) => {
        if (a.firstName < b.firstName) return -1
        if (a.firstName > b.firstName) return 1
        return 0
    })

    const sorted = useSortedCollection<Task>(searched, sortFn)
    const sortedCount = useCollectionCount(sorted)

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const paged = usePagedCollection<Task>(sorted, page, perPage)
    const pagedCount = useCollectionCount(paged)

    const selected = useSelectedCollection<Task>(collection)
    const selectedCount = useCollectionCount(selected)

    const cells = useMemo<(ICell & { cellFn: cellFn<Task> })[]>(
        () => [
            {
                title: 'Name',
                cellFn: (item: Task) => (
                    <Fragment>
                        <Text>{item.name}</Text>
                        <Text component="small">{item.description}</Text>
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
                                        {item.status}
                                    </Fragment>
                                }
                                style={{ gridRowGap: '8px' }}
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
                                {item.risk}
                            </Fragment>
                        ) : item.risk === Risk.Medium ? (
                            <Fragment>
                                <ExclamationIcon size="sm" color="var(--pf-global--warning-color--100)" /> &nbsp;
                                {item.risk}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ExclamationIcon size="sm" color="var(--pf-global--info-color--100)" /> &nbsp;
                                {item.risk}
                            </Fragment>
                        )}
                    </Fragment>
                ),
            },
        ],
        []
    )
    const rows = useRows(paged, selected, cells)

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
                    <Toolbar>
                        <ToolbarContent>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    rowGap: '16px',
                                    alignItems: 'center',
                                }}
                            >
                                <ToolbarItem variant="label">Update random item every</ToolbarItem>
                                <ToolbarItem>
                                    <EnumSelect value={updateTime} anEnum={UpdateTime} onChange={setUpdateTime} />
                                </ToolbarItem>
                                <ToolbarItem>
                                    <LabelGroup defaultIsOpen numLabels={999}>
                                        <Label variant="outline">{collectionCount} items</Label>
                                        <Label variant="outline">{selectedCount} selected</Label>
                                        <Label variant="outline">{filteredCount} filtered</Label>
                                        <Label variant="outline">{searchedCount} searched</Label>
                                        <Label variant="outline">{sortedCount} sorted</Label>
                                        <Label variant="outline">{pagedCount} paged</Label>
                                        <Label variant="outline">{++render} renders</Label>
                                    </LabelGroup>
                                </ToolbarItem>
                            </div>
                        </ToolbarContent>
                    </Toolbar>
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
                            onSelectPage={() => {
                                selected.pauseEvents()
                                selected.clear()
                                selected.insert(paged.items())
                                selected.resumeEvents()
                            }}
                            onSelectAll={() => selected.selectAll()}
                            selectionActions={[{ id: '1', children: 'Test' }]}
                            tableActions={[
                                { id: '1', children: 'Primary', isShared: true },
                                { id: '2', children: 'Secondary', isShared: true, variant: 'secondary' },
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
                                {/* <Divider /> */}
                                <Pagination
                                    variant="bottom"
                                    itemCount={searchedCount}
                                    page={page}
                                    onSetPage={(_, page) => setPage(page)}
                                    perPage={perPage}
                                    onPerPageSelect={(_, perPage) => setPerPage(perPage)}
                                />
                            </Fragment>
                        )}
                    </Stack>
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
