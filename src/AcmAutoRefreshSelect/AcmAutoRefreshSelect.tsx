import React, { useEffect, useState } from 'react'
import { SyncAltIcon } from '@patternfly/react-icons'
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core'
import { makeStyles } from '@material-ui/styles'

const DEFAULT_REFRESH_TIME = 60
const REFRESH_VALUES = [30, 60, 5 * 60, 30 * 60, 0]
const OVERVIEW_REFRESH_INTERVAL_COOKIE = 'acm-overview-interval-refresh-cookie'

export type AcmAutoRefreshSelectProps = {
    refetch: () => void
    pollInterval?: number
    refreshIntervals?: Array<number>
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


export const savePollInterval = (pollInterval: number|string|null) => {
    localStorage.setItem(OVERVIEW_REFRESH_INTERVAL_COOKIE, `${pollInterval}`)
}

const initializeLocalStorage = (initialValue: number|undefined) => {
    const key = OVERVIEW_REFRESH_INTERVAL_COOKIE
    return useState<number>(():number => {
        if (initialValue){
            window.localStorage.setItem(key, `${initialValue}`)
            return initialValue
        }
        else if (window && window.localStorage && window.localStorage.getItem(key)) {
            /* istanbul ignore next */
            const value = window.localStorage.getItem(key) ?? `${DEFAULT_REFRESH_TIME * 1000}`
            return parseInt(value, 10)
        }
        window.localStorage.setItem(key, `${DEFAULT_REFRESH_TIME * 1000}`)
        return DEFAULT_REFRESH_TIME * 1000
    })
}

export function AcmAutoRefreshSelect(props: AcmAutoRefreshSelectProps) {
    const [isOpen, setOpen] = useState<boolean>(false)
    const [selected, setStoredValue] = initializeLocalStorage(props.pollInterval)
    const [addedListener, setAddedListener] = useState<boolean>(false)
    const [docHidden, setDocHidden] = useState<boolean>(false)
    const onVisibilityChange = () => {
        setDocHidden(window.document.hidden)
    }
    if (!addedListener) {
        document.addEventListener('visibilitychange', onVisibilityChange)
        setAddedListener(true)
    }
    const setValue = (value: number) => {
        setStoredValue(value)
        window.localStorage.setItem(OVERVIEW_REFRESH_INTERVAL_COOKIE, `${value}`)
    }

    const classes = useStyles()
    const { refetch } = props

    useEffect(() => {
        refetch()
        savePollInterval(selected)
        if (!docHidden && selected !== 0) {
            const interval = setInterval(() => {
                refetch()
            }, selected)
            return () => {
                document.removeEventListener('visibilitychange', onVisibilityChange)
                setAddedListener(false)
                clearInterval(interval)
            }
        }
        return
    }, [selected, docHidden])

    const handleKeyPress = (e: React.KeyboardEvent) => {
        /* istanbul ignore else */
        if (e.key === 'Enter') {
            refetch()
        }
    }

    const autoRefreshChoices = (props.refreshIntervals || REFRESH_VALUES).map((pi) => {
        let id
        if (pi >= 60) {
            id = `refresh-${pi / 60}m`
        } else if (pi !== 0) {
            id = `refresh-${pi}s`
        } else {
            id = 'refresh-disable'
        }
        pi *= 1000
        return { id, pi }
    })

    const conversion = (pi: number) => {
        if (pi >= 60000) {
            return `Refresh every ${pi / 60000}m`
        } else if (pi !== 0) {
            return `Refresh every ${pi / 1000}s`
        } else {
            return 'Disable refresh'
        }
    }

    return (
        <div className={classes.container}>
            <div
                className={classes.reloadButton}
                tabIndex={0}
                id={'refresh-icon'}
                aria-label={'refresh-icon'}
                role={'button'}
                onClick={refetch}
                onKeyPress={handleKeyPress}
            >
                <SyncAltIcon className={classes.icon} />
            </div>
            <Dropdown
                className={classes.buttonTitle}
                aria-label={'refetch-intervals'}
                id="refresh-dropdown"
                onSelect={() => setOpen(!isOpen)}
                isOpen={isOpen}
                isPlain
                toggle={
                    <DropdownToggle
                        id="refresh-toggle"
                        aria-label="refresh-label"
                        isDisabled={false}
                        onToggle={() => setOpen(!isOpen)}
                    >
                        {conversion(selected)}
                    </DropdownToggle>
                }
                dropdownItems={autoRefreshChoices.map((item) => (
                    <DropdownItem key={item.id} {...item} onClick={() => setValue(item.pi)}>
                        {conversion(item.pi)}
                    </DropdownItem>
                ))}
            />
        </div>
    )
}
