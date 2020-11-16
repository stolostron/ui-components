import { Skeleton, Split, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core'
import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table'
import React, { Fragment } from 'react'

export function AcmLoadingTable() {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
        <Fragment>
            <Toolbar>
                <ToolbarContent>
                    <ToolbarItem style={{ height: '36px' }}></ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <Table
                cells={['Loading']}
                rows={rows.map((v) => {
                    return [
                        <Fragment key={v.toString()}>
                            <Skeleton></Skeleton>
                        </Fragment>,
                    ]
                })}
                variant={TableVariant.compact}
            >
                <TableHeader />
                <TableBody />
            </Table>
            <Split style={{ height: '68px' }}></Split>
        </Fragment>
    )
}
