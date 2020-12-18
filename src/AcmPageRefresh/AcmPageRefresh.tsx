import React, { useState } from 'react'
import { SyncAltIcon } from '@patternfly/react-icons'
import {
    Dropdown,
    DropdownItem,
    DropdownToggle,
    // DropdownPosition,
    // DropdownProps,
} from '@patternfly/react-core'

export type RefreshOption = {
    id: string
    text: string
}

export function AcmPageRefresh() {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [selected, onSelect] = useState<RefreshOption>({ id: 'refresh-30s', text: 'Refresh every 30s' })

    const dropdownItems = [
        { id: 'refresh-10s', text: 'Refresh every 10s' },
        { id: 'refresh-30s', text: 'Refresh every 30s' },
        { id: 'refresh-1m', text: 'Refresh every 1m' },
        { id: 'refresh-5m', text: 'Refresh every 5m' },
        { id: 'refresh-30m', text: 'Refresh every 30m' },
        { id: 'refresh-disable', text: 'Disable refresh' },
    ]

    return (
        <div>
            <SyncAltIcon />
            <Dropdown
                id="dropdown"
                onSelect={() => setOpen(false)}
                isOpen={isOpen}
                isPlain
                toggle={
                    <DropdownToggle id="refresh-toggle" isDisabled={false} onToggle={() => setOpen(!isOpen)}>
                        {selected.text}
                    </DropdownToggle>
                }
                dropdownItems={dropdownItems.map((item) => (
                    <DropdownItem key={item.id} {...item} onClick={() => onSelect(item)}>
                        {item.text}
                    </DropdownItem>
                ))}
            />
            <div>Last update: 10:10:10 AM </div>
        </div>
    )
}
