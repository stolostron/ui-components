import React from 'react'
import { Alert, AlertProps } from '@patternfly/react-core'

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
