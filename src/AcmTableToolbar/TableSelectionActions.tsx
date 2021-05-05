/* Copyright Contributors to the Open Cluster Management project */

import { Dropdown, DropdownItem, DropdownItemProps, DropdownToggle, KebabToggle } from '@patternfly/react-core'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { breakpoints } from './TableToolbarBreakpoints'

export interface TableSelectionActionsDropdownProps {
    selectionActions?: DropdownItemProps[]
    selectionBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function TableSelectionActionsDropdown(props: TableSelectionActionsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isCompact, setIsCompact] = useState(false)

    const handleResize = useCallback(() => {
        if (!props.selectionBreakpoint) return
        const breakpointWidth = breakpoints[props.selectionBreakpoint]
        if (!breakpointWidth) return
        const isBelowBreakpoint = window.innerWidth < breakpointWidth
        setIsCompact(isBelowBreakpoint)
    }, [props.selectionBreakpoint])

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    return (
        <Fragment>
            {props.selectionActions && (
                <Dropdown
                    isOpen={isOpen}
                    toggle={
                        isCompact ? (
                            <KebabToggle id="selection-actions-toggle" isPrimary onToggle={setIsOpen} />
                        ) : (
                            <DropdownToggle id="selection-actions-toggle" isPrimary onToggle={setIsOpen}>
                                Actions
                            </DropdownToggle>
                        )
                    }
                    dropdownItems={props.selectionActions.map((dropdownProps, index) => (
                        <DropdownItem key={index} {...dropdownProps}>
                            {dropdownProps.children}
                        </DropdownItem>
                    ))}
                />
            )}
        </Fragment>
    )
}
