/* Copyright Contributors to the Open Cluster Management project */

import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox } from '@patternfly/react-core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { breakpoints } from './TableToolbarBreakpoints'

export interface TableSelectionDropdownProps {
    itemCount: number
    selectedCount: number
    perPage: number
    onSelectNone: () => void
    onSelectPage: () => void
    onSelectAll: () => void
    selectionBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function TableSelectionDropdown(props: TableSelectionDropdownProps) {
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

    const onToggleCheckbox = useCallback(() => {
        if (props.selectedCount > 0) props.onSelectNone()
        else props.onSelectAll()
    }, [props.selectedCount, props.onSelectNone, props.onSelectAll])

    const toggleText = useMemo(() => {
        return props.selectedCount !== 0
            ? isCompact
                ? `${props.selectedCount}`
                : `${props.selectedCount} selected`
            : null
    }, [props.selectedCount, isCompact, props.selectedCount])

    const toggle = useMemo(() => {
        return (
            <DropdownToggle
                splitButtonItems={[
                    <DropdownToggleCheckbox
                        id="select-all"
                        key="select-all"
                        aria-label="Select all"
                        isChecked={props.selectedCount > 0}
                        onChange={onToggleCheckbox}
                    >
                        {toggleText}
                    </DropdownToggleCheckbox>,
                ]}
                onToggle={(isOpen) => setIsOpen(isOpen)}
            />
        )
    }, [props.selectedCount, toggleText])

    const selectNoneDropdownItem = useMemo(() => {
        return (
            <DropdownItem
                id="select-none"
                key="select-none"
                onClick={() => {
                    props.onSelectNone()
                    setIsOpen(false)
                }}
            >
                Select none
            </DropdownItem>
        )
    }, [props.onSelectNone])

    const selectPageDropdownItem = useMemo(() => {
        return (
            <DropdownItem
                id="select-page"
                key="select-page"
                onClick={() => {
                    props.onSelectPage()
                    setIsOpen(false)
                }}
            >
                {`Select ${Math.min(props.perPage, props.itemCount)} page items`}
            </DropdownItem>
        )
    }, [props.onSelectPage, props.perPage, props.itemCount])

    const selectAllDropdownItem = useMemo(() => {
        return (
            <DropdownItem
                id="select-all"
                key="select-all"
                onClick={() => {
                    props.onSelectAll()
                    setIsOpen(false)
                }}
            >
                {`Select all ${props.itemCount} items`}
            </DropdownItem>
        )
    }, [props.onSelectAll, props.itemCount])

    const dropdownItems = useMemo(() => [selectNoneDropdownItem, selectPageDropdownItem, selectAllDropdownItem], [
        selectNoneDropdownItem,
        selectPageDropdownItem,
        selectAllDropdownItem,
    ])

    return <Dropdown isOpen={isOpen} toggle={toggle} dropdownItems={dropdownItems} />
}
