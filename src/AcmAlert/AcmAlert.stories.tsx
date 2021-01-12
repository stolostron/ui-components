import '@patternfly/react-core/dist/styles/base.css'
import React, { useContext } from 'react'
import { AcmAlertGroup, AcmAlertProvider, AcmAlertContext } from './AcmAlert'
import { AcmPageCard } from '../AcmPage/AcmPage'
import { AcmButton } from '../AcmButton/AcmButton'

export default {
    title: 'AcmAlertGroup',
    component: AcmAlertGroup,
    argTypes: {
        isInline: { defaultValue: true },
        canClose: { defaultValue: true },
    },
}

export const AlertGroup = (args) => {
    const AddAlert = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.addAlert({ title: 'Alert', message: 'Message' })
                }}
            >
                Add Alert
            </AcmButton>
        )
    }
    const AddInfo = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.addAlert({ title: 'Info Alert', message: 'Message', type: 'info' })
                }}
            >
                Add Info
            </AcmButton>
        )
    }
    const AddSuccess = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.addAlert({ title: 'Success Alert', message: 'Message', type: 'success' })
                }}
            >
                Add Success
            </AcmButton>
        )
    }
    const AddWarning = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.addAlert({ title: 'Warning Alert', message: 'Message', type: 'warning' })
                }}
            >
                Add Warning
            </AcmButton>
        )
    }
    const AddError = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.addAlert({ title: 'Error Alert', message: 'Message', type: 'danger' })
                }}
            >
                Add Error
            </AcmButton>
        )
    }
    const ClearAlerts = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.clearAlerts()
                }}
            >
                Clear Alerts
            </AcmButton>
        )
    }
    const ClearInfoAlerts = () => {
        const alertContext = useContext(AcmAlertContext)
        return (
            <AcmButton
                onClick={() => {
                    alertContext.clearAlerts((a) => a.type === 'info')
                }}
            >
                Clear Info Alerts
            </AcmButton>
        )
    }
    return (
        <AcmAlertProvider>
            <AcmPageCard>
                <AcmAlertGroup isInline={args.isInline} canClose={args.canClose} alertMargin="0 0 24px 0" />
                <AddAlert /> <AddInfo /> <AddSuccess /> <AddWarning /> <AddError /> <ClearAlerts /> <ClearInfoAlerts />
            </AcmPageCard>
        </AcmAlertProvider>
    )
}
