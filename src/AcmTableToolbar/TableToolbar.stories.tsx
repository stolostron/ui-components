/* Copyright Contributors to the Open Cluster Management project */

import {
    Alert,
    AlertGroup,
    Button,
    Card,
    CardBody,
    Hint,
    HintBody,
    HintFooter,
    HintTitle,
    Page,
    PageSection,
    Pagination,
    Stack,
} from '@patternfly/react-core'
import { Divider } from '@patternfly/react-core/src/components/Divider'
import { Table, TableBody, TableHeader } from '@patternfly/react-table'
import { Meta } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import { TableFilterProps } from './TableFilter'
import { TableToolbar } from './TableToolbar'

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

export const Table_Toolbar = (args: { Search: boolean; 'Status Filter': boolean; 'Risk Filter': boolean }) => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<string[]>([])
    const [risk, setRisk] = useState<string[]>([])

    const itemCount = 1000
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

    const columns = ['Repositories', 'Branches', 'Pull requests', 'Workspaces', 'Last commit']
    const rows = [
        ['Repository one', 'Branch one', 'PR one', 'Workspace one', 'Commit one'],
        ['Repository two', 'Branch two', 'PR two', 'Workspace two', 'Commit two'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
        ['Repository three', 'Branch three', 'PR three', 'Workspace three', 'Commit three'],
    ]

    return (
        <Page>
            <PageSection>
                <Stack hasGutter>
                    <AlertGroup>
                        <Alert title="Alert" isInline variant="success" />
                        <Alert title="Alert" isInline variant="info" />
                        <Alert title="Alert" isInline variant="danger" />
                    </AlertGroup>
                    {/* <Hint>
                        <HintTitle>Do more with Find it Fix it capabilities</HintTitle>
                        <HintBody>
                            Upgrade to Red Hat Smart Management to remediate all your systems across regions and
                            geographies.
                        </HintBody>
                        <HintFooter>
                            <Button variant="link" isInline>
                                Try it for 90 days
                            </Button>
                        </HintFooter>
                    </Hint>
                    <Card>
                        <CardBody>Card</CardBody>
                    </Card> */}
                    <Stack>
                        <TableToolbar
                            itemCount={itemCount}
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
                            onSelectNone={() => setSelectedCount(0)}
                            onSelectPage={() => setSelectedCount(perPage)}
                            onSelectAll={() => setSelectedCount(itemCount)}
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
                        <Table
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
                        </Table>
                        <Divider />
                        <Pagination
                            variant="bottom"
                            itemCount={itemCount}
                            page={page}
                            onSetPage={(_, page) => setPage(page)}
                            perPage={perPage}
                            onPerPageSelect={(_, perPage) => setPerPage(perPage)}
                        />
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
