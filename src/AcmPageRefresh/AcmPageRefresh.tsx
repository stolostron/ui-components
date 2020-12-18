import React, { useState } from 'react'
import { SyncAltIcon } from '@patternfly/react-icons'
import {
    Dropdown,
    DropdownItem,
    DropdownToggle,
    // DropdownPosition,
    // DropdownProps,
} from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'
// import { Grid, GridItem } from '@patternfly/react-core';

export type RefreshOption = {
    id: string
    text: string
}

const useStyles = makeStyles({
    container: {
        'max-width': '225px',
    },
    buttonTitle: {
        'max-width': '200px',
        '& button': {
            '& span': {
                color: 'var(--pf-global--primary-color--100)',
            },
            '&:hover, &:focus': {
                '& span': {
                    color: 'var(--pf-global--primary-color--200)',
                },
            },
        },
    },
    icon: {
        'max-width': '25px',
        color: 'var(--pf-global--primary-color--100)',
    },
    timestamp: {
        color: '#5A6872', // How to get equivalent 'var(--pf-global--primary-color--  ?
        'font-family': 'RedHatText',
        'font-size': '10px',
        'line-height': '20px',
        'text-align': 'right',
        'margin-right': '50px',
    },
})

export function AcmPageRefresh() {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [selected, onSelect] = useState<RefreshOption>({ id: 'refresh-30s', text: 'Refresh every 30s' })
    const classes = useStyles()

    const dropdownItems = [
        { id: 'refresh-10s', text: 'Refresh every 10s' },
        { id: 'refresh-30s', text: 'Refresh every 30s' },
        { id: 'refresh-1m', text: 'Refresh every 1m' },
        { id: 'refresh-5m', text: 'Refresh every 5m' },
        { id: 'refresh-30m', text: 'Refresh every 30m' },
        { id: 'refresh-disable', text: 'Disable refresh' },
    ]

    return (
        <div className={classes.container}>
            <div>
            <SyncAltIcon className={classes.icon} />
            <Dropdown
                className={classes.buttonTitle}
                id="refresh-dropdown"
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
            </div>
            <div className={classes.timestamp}>
                Last update: 10:10:10 AM
            </div>
        </div>
    )
}
