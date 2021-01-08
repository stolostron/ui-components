import React, { useEffect, useState } from 'react'
import { SyncAltIcon } from '@patternfly/react-icons'
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const DEFAULT_REFRESH_TIME = 30
const REFRESH_VALUES = [1, 5, 10, 30, 60, 5 * 60, 30 * 60, 0]

export type AcmAutoRefreshSelectProps = {
    refetch: () => void
    refreshCookie: string
    pollInterval: number
}

interface RefreshOption {
    id: string
    text: string
    pollInterval: number
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '225px',
    },
    reloadButton: {
        cursor: 'pointer',
    },
    buttonTitle: {
        maxWidth: '200px',
        '& button': {
            '& span': {
                fontSize: 'var(--pf-global--FontSize--sm)',
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
        maxWidth: '25px',
        color: 'var(--pf-global--primary-color--100)',
    },
})

export const getPollInterval = (cookieKey: string) => {
    let pollInterval = DEFAULT_REFRESH_TIME * 1000
    if (cookieKey) {
        const savedInterval = localStorage.getItem(cookieKey)
        if (savedInterval) {
            try {
                const saved = JSON.parse(savedInterval)
                if (saved.pollInterval !== undefined) {
                    console.log('saved', saved.pollInterval)

                    pollInterval = saved.pollInterval
                }
            } catch (e) {
                //
            }
        } else {
            savePollInterval(cookieKey, pollInterval)
        }
    }
    return pollInterval
}

export const savePollInterval = (cookieKey: string, pollInterval: number) => {
    localStorage.setItem(cookieKey, JSON.stringify({ pollInterval }))
}

export function AcmAutoRefreshSelect(props: AcmAutoRefreshSelectProps) {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<RefreshOption>({
        id: 'refresh-30s',
        text: 'Refresh every 30s',
        pollInterval: 30000,
    })
    const [pollInterval, setPollInterval] = useState(props.pollInterval)
    const classes = useStyles()
    const { refetch, refreshCookie } = props

    useEffect(() => {
        refetch()
        setPollInterval(selected.pollInterval)
        savePollInterval(refreshCookie, selected.pollInterval)
        if (selected.pollInterval !== 0) {
            const interval = setInterval(() => {
                console.log('Refetching every: ', selected.pollInterval)
            }, selected.pollInterval)
            return () => clearInterval(interval)
        }
    }, [selected])

    const handleRefresh = () => {
        console.log('refetch', pollInterval)

        refetch()
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            refetch()
        }
    }

    const autoRefreshChoices = REFRESH_VALUES.map((pollInterval) => {
        let id, text
        if (pollInterval >= 60) {
            id = `refresh-${pollInterval / 60}m`
            text = `Refresh every ${pollInterval / 60}m`
        } else if (pollInterval !== 0) {
            id = `refresh-${pollInterval}s`
            text = `Refresh every ${pollInterval}s`
        } else {
            id = 'refresh-disable'
            text = 'Disable refresh'
        }
        pollInterval *= 1000
        return { id, text, pollInterval }
    })

    return (
        <div className={classes.container}>
            <div
                className={classes.reloadButton}
                tabIndex={0}
                role={'button'}
                onClick={handleRefresh}
                onKeyPress={handleKeyPress}
            >
                <SyncAltIcon className={classes.icon} />
            </div>
            <Dropdown
                className={classes.buttonTitle}
                id="refresh-dropdown"
                onSelect={() => setOpen(!isOpen)}
                isOpen={isOpen}
                isPlain
                toggle={
                    <DropdownToggle id="refresh-toggle" isDisabled={false} onToggle={() => setOpen(!isOpen)}>
                        {selected.text}
                    </DropdownToggle>
                }
                dropdownItems={autoRefreshChoices.map((item) => (
                    <DropdownItem key={item.id} {...item} onClick={() => setSelected(item)}>
                        {item.text}
                    </DropdownItem>
                ))}
            />
        </div>
    )
}
