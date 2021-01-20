import React from 'react'
import { Spinner } from '@patternfly/react-core'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    MinusCircleIcon,
} from '@patternfly/react-icons'
import { AcmIcon, AcmIconVariant } from '../AcmIcons/AcmIcons'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    container: {
        display: 'flex',
    },
    icon: {
        width: '18px', // Progress size md is 18px
    },
    iconMargin: {
        margin: '3px 2px 1px 2px',
    },
})

export enum StatusType {
    'healthy' = 'healthy',
    'danger' = 'danger',
    'warning' = 'warning',
    'progress' = 'progress',
    'detached' = 'detached',
    'unknown' = 'unknown',
}

export function AcmInlineStatus(props: { type: StatusType; status: string }) {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <div className={classes.icon}>
                <StatusIcon type={props.type} />
            </div>
            <span style={{ marginLeft: '.4rem' }}>{props.status}</span>
        </div>
    )
}

function StatusIcon(props: { type: StatusType }) {
    const classes = useStyles()
    switch (props.type) {
        case StatusType.healthy:
            return <CheckCircleIcon className={classes.iconMargin} color="var(--pf-global--success-color--100)" />
        case StatusType.danger:
            return <ExclamationCircleIcon className={classes.iconMargin} color="var(--pf-global--danger-color--100)" />
        case StatusType.warning:
            return (
                <ExclamationTriangleIcon className={classes.iconMargin} color="var(--pf-global--warning-color--100)" />
            )
        case StatusType.progress:
            return <Spinner size="md" style={{ verticalAlign: 'middle' }} />
        case StatusType.detached:
            return <AcmIcon icon={AcmIconVariant.brokenlink} />
        case 'unknown':
        default:
            return <MinusCircleIcon className={classes.iconMargin} color="var(--pf-global--disabled-color--100)" />
    }
}
