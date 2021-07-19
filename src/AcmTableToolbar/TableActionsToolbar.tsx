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
import React, { Fragment, ReactNode, useMemo, useState } from 'react'

export type ITableAction = {
    id: string
    label: ReactNode
    variant?: 'primary' | 'secondary'
    action: () => void
}
// | {
//       variant?: 'seperator'
//   }

export type TableToolbarAction = OverflowMenuDropdownItemProps & { variant?: 'primary' | 'secondary' }

export type TableActionsToolbarProps = {
    tableActions?: TableToolbarAction[]
    selectedCount: number
    actionsBreakpoint?: 'md' | 'lg' | 'xl' | '2xl'
}

export function TableActionsToolbar(props: TableActionsToolbarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const OverflowMenuButtonContent = useMemo(() => {
        if (!props.tableActions) return <Fragment />
        const sharedActions = props.tableActions.filter((action) => (action as OverflowMenuDropdownItemProps).isShared)
        if (sharedActions.length === 0) return <Fragment />
        return (
            <OverflowMenuContent>
                <OverflowMenuGroup groupType="button">
                    {sharedActions.map((action) => (
                        <OverflowMenuItem key={action.key ?? action.id}>
                            <Button
                                variant={
                                    action.variant
                                        ? action.variant
                                        : props.selectedCount
                                        ? ButtonVariant.secondary
                                        : ButtonVariant.primary
                                }
                            >
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
                        <OverflowMenuDropdownItem key={action.key ?? action.id} {...action}>
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
