import { ToolbarGroup, ToolbarItem } from '@patternfly/react-core'
import React, { Fragment, useMemo } from 'react'
import { TableSelectionActionsDropdown, TableSelectionActionsDropdownProps } from './TableSelectionActions'
import { TableSelectionDropdown, TableSelectionDropdownProps } from './TableSelectionDropdown'

export type TableSelectionToolbarProps = TableSelectionDropdownProps & TableSelectionActionsDropdownProps

export function TableSelectionToolbar(props: TableSelectionToolbarProps) {
    if (!props.onSelectPage || props.itemCount === 0) return <Fragment />

    const actionsToolbarItem = useMemo(() => {
        if (props.selectedCount !== 0 && props.selectionActions && props.selectionActions.length > 0) {
            return (
                <ToolbarItem>
                    <TableSelectionActionsDropdown {...props} />
                </ToolbarItem>
            )
        } else {
            return <Fragment />
        }
    }, [props.selectedCount, props.selectionActions])

    return (
        <ToolbarGroup variant="button-group">
            <ToolbarItem>
                <TableSelectionDropdown {...props} />
            </ToolbarItem>
            {actionsToolbarItem}
        </ToolbarGroup>
    )
}
