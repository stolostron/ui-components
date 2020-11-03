import React from 'react'
import { Alert, AlertGroup, AlertProps } from '@patternfly/react-core'
import { AlertGroupProps } from '@patternfly/react-core/dist/js/components/AlertGroup/AlertGroup'

type AcmAlertProps = AlertProps & {
    subtitle?: string | React.ReactNode
}

export function AcmAlert(props: AcmAlertProps) {
    return (
        <Alert {...props}>
            <p>{props.subtitle}</p>
        </Alert>
    )
}

export function AcmAlertGroup(props: AlertGroupProps) {
    return <AlertGroup {...props} ref={null} />
}
