import { Alert, AlertGroup, Card, Divider, Page, PageSection, Pagination, Stack, Title } from '@patternfly/react-core'
import { auto } from '@patternfly/react-core/dist/js/helpers/Popper/thirdparty/popper-core'
import { useMediaQuery } from '@react-hook/media-query'
import Fuse from 'fuse.js'
import React, { Fragment, ReactNode, useMemo } from 'react'
import { ICollection } from './collections'
import { CollectionTable } from './CollectionTable'
import { ITableAction, TableToolbarAction } from './TableActionsToolbar'
import { TableFilterProps } from './TableFilter'
import { TableToolbar } from './TableToolbar'
import { IRowColumn, useRows } from './useRows'
import { useTableCollection } from './useTableCollection'

export interface ITableAlert {
    title: string
}

export function TablePage<T = any>(props: {
    title: string
    collection: ICollection<T>
    columns: IRowColumn<T>[]
    searchKeys?: Fuse.FuseOptionKey[]
    tableActions?: ITableAction[]
    filters?: TableFilterProps<T>[]
    alerts?: ITableAlert[]
    setAlerts?: (setAlerts: (alerts: ITableAlert[]) => ITableAlert[]) => void
}) {
    const matches = useMediaQuery('(max-width: 768px)')
    const tableCollection = useTableCollection<T>(props.collection, props.searchKeys)
    const rows = useRows(tableCollection.paged, tableCollection.selected, props.columns)
    const tableActions = useMemo<TableToolbarAction[] | undefined>(
        () =>
            props.tableActions?.map((action) => ({
                id: action.id,
                children: action.label,
                variant: action.variant,
                isShared: action.variant !== undefined,
                onClick: () => action.action(),
            })),
        [props.tableActions]
    )

    // const sortFn = useCallback(
    //     (a: T, b: T) => {
    //         switch (tableCollection.sortBy?.index) {
    //             case 1:
    //                 if (tableCollection.sortBy.direction === 'asc') return compareStrings(a.name, b.name)
    //                 else return compareStrings(b.name, a.name)
    //             case 2:
    //                 if (tableCollection.sortBy.direction === 'asc') return compareNumbers(a.progress, b.progress)
    //                 else return compareNumbers(b.progress, a.progress)
    //             case 3:
    //                 if (tableCollection.sortBy.direction === 'asc') return compareStrings(a.risk, b.risk)
    //                 else return compareStrings(b.risk, a.risk)
    //         }
    //         return undefined
    //     },
    //     [tableCollection.sortBy]
    // )
    // useEffect(() => tableCollection.setSortFn((ttt) => sortFn), [sortFn])

    return (
        <Page
            additionalGroupedContent={
                <PageSection variant="light">
                    <Title headingLevel="h1">{props.title}</Title>
                </PageSection>
            }
            groupProps={{ sticky: matches ? undefined : 'top' }}
        >
            {matches ? (
                <Fragment>
                    {props.alerts && props.alerts.length > 0 && (
                        <PageSection variant="light" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                            <AlertGroup>
                                {props.alerts?.map((alertInfo) => (
                                    <Alert {...alertInfo} isInline />
                                ))}
                            </AlertGroup>
                        </PageSection>
                    )}
                    <TableToolbar
                        {...tableCollection}
                        filters={props.filters}
                        filteredCount={tableCollection.itemCount}
                        tableActions={tableActions}
                    />
                    <Divider />
                    <TableContainer>
                        <CollectionTable<T> {...tableCollection} columns={props.columns} rows={rows} />
                    </TableContainer>

                    <TablePagination {...tableCollection} />
                </Fragment>
            ) : (
                <Fragment>
                    <PageSection>
                        <Stack hasGutter>
                            {props.alerts && props.alerts.length > 0 && (
                                <AlertGroup>
                                    {props.alerts?.map((alertInfo) => (
                                        <Alert {...alertInfo} isInline />
                                    ))}
                                </AlertGroup>
                            )}
                            <Card>
                                <TableToolbar<T>
                                    {...tableCollection}
                                    filters={props.filters}
                                    filteredCount={tableCollection.itemCount}
                                    tableActions={tableActions}
                                />
                                <TableContainer>
                                    <CollectionTable<T> {...tableCollection} columns={props.columns} rows={rows} />
                                </TableContainer>
                                <TablePagination {...tableCollection} />
                            </Card>
                        </Stack>
                    </PageSection>
                </Fragment>
            )}
        </Page>
    )
}

export function TablePagination(props: {
    searchedCount: number
    page: number
    setPage: (page: number) => void
    perPage: number
    setPerPage: (perPage: number) => void
}) {
    return (
        <Pagination
            style={{ zIndex: 4 }}
            variant="bottom"
            itemCount={props.searchedCount}
            page={props.page}
            onSetPage={(_, page) => props.setPage(page)}
            perPage={props.perPage}
            onPerPageSelect={(_, perPage) => props.setPerPage(perPage)}
        />
    )
}

function TableContainer(props: { children: ReactNode }) {
    return (
        <div
            style={{
                overflowX: auto,
            }}
        >
            {props.children}
        </div>
    )
}
