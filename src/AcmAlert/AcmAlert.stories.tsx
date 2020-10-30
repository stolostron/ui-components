import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmAlert } from './AcmAlert'
import { AcmPageCard } from '../AcmPage/AcmPage'
import { AlertVariant } from '@patternfly/react-core'

export default {
    title: 'Alert',
    component: AcmAlert,
}

const alerts = {
    default: 'Default alert title',
    info: 'Info alert title',
    success: 'Success alert title',
    warning: 'Warning alert title',
    danger: 'Danger alert title',
}

export const Alerts = () => {
    return (
        <AcmPageCard>
            {Object.keys(alerts).map((key) => {
                return (
                    <AcmAlert
                        key={key}
                        variant={AlertVariant[key]}
                        title={alerts[key]}
                        style={{ marginBottom: '12px' }}
                        subtitle={`${alerts[key]} description`}
                    />
                )
            })}
        </AcmPageCard>
    )
}

export const InlineAlerts = () => {
    return (
        <AcmPageCard>
            {Object.keys(alerts).map((key) => {
                return (
                    <AcmAlert
                        isInline
                        key={key}
                        variant={AlertVariant[key]}
                        title={alerts[key]}
                        style={{ marginBottom: '12px' }}
                        subtitle={`${alerts[key]} description`}
                    />
                )
            })}
        </AcmPageCard>
    )
}
