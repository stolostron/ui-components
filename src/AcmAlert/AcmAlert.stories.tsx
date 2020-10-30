import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmAlert } from './AcmAlert'
import { AcmPageCard } from '../AcmPage/AcmPage'
import { AlertVariant } from '@patternfly/react-core'

export default {
    title: 'Alert',
    component: AcmAlert,
    argTypes: {
        isInline: { control: 'boolean' },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        variant: {
            control: { type: 'select', options: Object.values(AlertVariant) },
        },
    },
}

export const Alerts = (args) => {
    return (
        <AcmPageCard>
            <AcmAlert variant={args.variant} isInline={args.isInline} title={args.title} subtitle={args.subtitle} />
        </AcmPageCard>
    )
}
Alerts.args = { title: 'Alert title', subtitle: 'Alert subtitle' }
