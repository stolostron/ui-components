import React, { useState } from 'react'
import { Alert, AlertActionCloseButton, AlertGroup, AlertProps } from '@patternfly/react-core'
import { AlertGroupProps } from '@patternfly/react-core/dist/js/components/AlertGroup/AlertGroup'
import { makeStyles } from '@material-ui/styles'

type AcmAlertProps = AlertProps & {
    subtitle?: string | React.ReactNode
    staticAlert?: boolean
}

const useStyles = makeStyles({
    alert: {
        '--pf-c-alert--BoxShadow': '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        '--pf-c-alert__icon--MarginRight': '1rem',
    },
})

export function AcmAlert(props: AcmAlertProps) {
    const classes = useStyles()

    const { staticAlert, ...otherProps } = props
    const [showAlert, setShowAlert] = useState(true)
    const closeAlert = !staticAlert && <AlertActionCloseButton onClose={() => setShowAlert(!showAlert)} />
    return showAlert ? (
        <Alert {...otherProps} actionClose={closeAlert} className={classes.alert}>
            <p>{props.subtitle}</p>
        </Alert>
    ) : null
}

export function AcmAlertGroup(props: AlertGroupProps) {
    return <AlertGroup {...props} ref={null} />
}
