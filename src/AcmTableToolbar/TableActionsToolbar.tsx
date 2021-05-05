/* Copyright Contributors to the Open Cluster Management project */

import {
    Button,
    ButtonVariant,
    Dropdown,
    KebabToggle,
    OverflowMenu,
    OverflowMenuContent,
    OverflowMenuControl,
    OverflowMenuDropdownItem,
    OverflowMenuDropdownItemProps,
    OverflowMenuGroup,
    OverflowMenuItem,
    ToolbarItem,
} from '@patternfly/react-core'
import React, { Fragment, useMemo, useState } from 'react'

export type TableActionsToolbarProps = {
    tableActions?: OverflowMenuDropdownItemProps[]
    selectedCount: number
    actionsBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
}

export function TableActionsToolbar(props: TableActionsToolbarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const OverflowMenuButtonContent = useMemo(() => {
        if (!props.tableActions) return <Fragment />
        const sharedActions: OverflowMenuDropdownItemProps[] = props.tableActions.filter(
            (action) => (action as OverflowMenuDropdownItemProps).isShared
        )
        if (sharedActions.length === 0) return <Fragment />
        return (
            <OverflowMenuContent>
                <OverflowMenuGroup groupType="button">
                    {sharedActions.map((action) => (
                        <OverflowMenuItem key={action.key}>
                            <Button variant={props.selectedCount ? ButtonVariant.secondary : ButtonVariant.primary}>
                                {action.children}
                            </Button>
                        </OverflowMenuItem>
                    ))}
                </OverflowMenuGroup>
            </OverflowMenuContent>
        )
    }, [props.tableActions])

    const OverflowMenuButtonControl = useMemo(() => {
        if (!props.tableActions) return <Fragment />
        const sharedActions: OverflowMenuDropdownItemProps[] = props.tableActions.filter(
            (action) => (action as OverflowMenuDropdownItemProps).isShared
        )
        const hasAdditionalOptions = sharedActions.length !== props.tableActions.length
        return (
            <OverflowMenuControl hasAdditionalOptions={hasAdditionalOptions}>
                <Dropdown
                    isOpen={isOpen}
                    toggle={<KebabToggle onToggle={setIsOpen} />}
                    isPlain
                    dropdownItems={props.tableActions.map((action) => (
                        <OverflowMenuDropdownItem key={action.key} {...action}>
                            {action.children}
                        </OverflowMenuDropdownItem>
                    ))}
                />
            </OverflowMenuControl>
        )
    }, [props.tableActions, isOpen])

    if (!props.tableActions?.length) return <Fragment />

    return (
        <ToolbarItem variant="overflow-menu">
            <OverflowMenu breakpoint={props.actionsBreakpoint ?? 'lg'}>
                {OverflowMenuButtonContent}
                {OverflowMenuButtonControl}
            </OverflowMenu>
        </ToolbarItem>
    )
}
