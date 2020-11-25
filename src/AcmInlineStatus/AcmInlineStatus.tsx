import React from 'react'
import { Spinner } from '@patternfly/react-core'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    MinusCircleIcon,
} from '@patternfly/react-icons'

export enum StatusType {
    'healthy' = 'healthy',
    'danger' = 'danger',
    'warning' = 'warning',
    'progress' = 'progress',
    'unknown' = 'unknown',
}

export function AcmInlineStatus(props: { type: StatusType; status: string }) {
    return (
        <div className={`inline-status-${props.type}`}>
            <StatusIcon type={props.type} />
            <span style={{ marginLeft: '.4rem' }}>{props.status}</span>
        </div>
    )
}

function StatusIcon(props: { type: StatusType }) {
    switch (props.type) {
        case StatusType.healthy:
            return <CheckCircleIcon color="var(--pf-global--success-color--100)" />
        case StatusType.danger:
            return <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
        case StatusType.warning:
            return <ExclamationTriangleIcon color="var(--pf-global--warning-color--100)" />
        case StatusType.progress:
            return <Spinner size="md" style={{ verticalAlign: 'middle' }} />
        case 'unknown':
        default:
            return <MinusCircleIcon color="var(--pf-global--disabled-color--100)" />
    }
}
