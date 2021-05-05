/* Copyright Contributors to the Open Cluster Management project */

import { Pagination, ToolbarItem } from '@patternfly/react-core'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { breakpoints } from './TableToolbarBreakpoints'

export type TablePaginationToolbarProps = {
    itemCount: number
    page: number
    perPage: number
    setPage: (page: number) => void
    setPerPage: (perPage: number) => void
    paginationBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    paginationLargeBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'never'
}

export function TablePaginationToolbar(props: TablePaginationToolbarProps) {
    const [isHidden, setIsHidden] = useState(true)
    const [isCompact, setIsCompact] = useState(false)

    const handleResize = useCallback(() => {
        if (props.paginationBreakpoint) {
            const breakpointWidth = breakpoints[props.paginationBreakpoint]
            if (breakpointWidth) {
                const isBelowBreakpoint = window.innerWidth < breakpointWidth
                setIsHidden(isBelowBreakpoint)
            }
        }
        if (props.paginationLargeBreakpoint) {
            if (props.paginationLargeBreakpoint === 'never') {
                setIsCompact(true)
            } else {
                const breakpointWidth = breakpoints[props.paginationLargeBreakpoint]
                if (breakpointWidth) {
                    const isBelowBreakpoint = window.innerWidth < breakpointWidth
                    setIsCompact(isBelowBreakpoint)
                }
            }
        }
    }, [props.paginationBreakpoint, props.paginationLargeBreakpoint])

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    if (isHidden) return <Fragment />
    return (
        <ToolbarItem variant="pagination">
            <Pagination
                variant="top"
                itemCount={props.itemCount}
                page={props.page}
                onSetPage={(_, page) => props.setPage(page)}
                perPage={props.perPage}
                onPerPageSelect={(_, perPage) => props.setPerPage(perPage)}
                isCompact={isCompact}
            />
        </ToolbarItem>
    )
}
