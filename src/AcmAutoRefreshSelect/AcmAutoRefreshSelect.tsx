import React, { useEffect, useState } from 'react'
import { SyncAltIcon } from '@patternfly/react-icons'
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const DEFAULT_REFRESH_TIME = 60

export type AcmAutoRefreshSelectProps = {
    refetch: () => void
    refreshValues: number[]
    refreshCookie: string
    pollInterval: number
    startPolling: (pollInterval: number) => void
    stopPolling: () => void
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
        pollInterval: 30,
    })
    const [pollInterval, setPollInterval] = useState(props.pollInterval)
    const classes = useStyles()
    const { refetch, refreshValues = [] } = props

    const autoRefreshChoices = refreshValues.map((pollInterval) => {
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

    const handleOptionClick = (item: RefreshOption) => {
        setSelected(item)
        setPollInterval(item.pollInterval)
    }

    useEffect(() => {
        console.log('selected', selected)
        console.log('pollInterval', pollInterval)

        const { refreshCookie, startPolling, stopPolling } = props
        if (pollInterval === 0) {
            stopPolling()
        } else {
            startPolling(pollInterval)
        }
        savePollInterval(refreshCookie, pollInterval)
    }, [selected])

    const handleRefresh = () => {
        refetch()
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            refetch()
        }
    }

    return (
        <div className={classes.container}>
            <div
                className={classes.reloadButton}
                tabIndex={0}
                role={'button'}
                onClick={() => {
                    handleRefresh()
                }}
                onKeyPress={(e) => handleKeyPress(e)}
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
                    <DropdownItem key={item.id} {...item} onClick={() => handleOptionClick(item)}>
                        {item.text}
                    </DropdownItem>
                ))}
            />
        </div>
    )
}
