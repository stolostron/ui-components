import Collapse from '@material-ui/core/Collapse'
import { Alert, AlertActionCloseButton } from '@patternfly/react-core'
import React, {
    createContext,
    CSSProperties,
    Fragment,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

export interface AcmAlertInfo {
    type?: 'success' | 'danger' | 'warning' | 'info' | 'default'
    title: ReactNode
    message?: ReactNode
    actions?: ReactNode
    id?: string
    group?: string
}

export interface IAlertContext {
    readonly activeAlerts: AcmAlertInfo[]
    readonly alertInfos: AcmAlertInfo[]
    addAlert: (alertInfo: AcmAlertInfo) => void
    removeAlert: (alertInfo: AcmAlertInfo) => void
    removeVisibleAlert: (alertInfo: AcmAlertInfo) => void
    clearAlerts: (matcher?: (alertInfo: AcmAlertInfo) => boolean) => void
}

/* istanbul ignore next */
const noop = () => null

export const AcmAlertContext = createContext<IAlertContext>({
    activeAlerts: [],
    alertInfos: [],
    addAlert: noop,
    removeAlert: noop,
    removeVisibleAlert: noop,
    clearAlerts: noop,
})

export function AcmAlertProvider(props: { children: ReactNode }) {
    const [activeAlerts, setActiveAlerts] = useState<AcmAlertInfo[]>([])
    const [visibleAlerts, setVisibleAlerts] = useState<AcmAlertInfo[]>([])
    const addAlert = useCallback<(alertInfo: AcmAlertInfo) => void>((alert: AcmAlertInfo) => {
        alert.id = Math.random().toString(36).substring(7)
        setActiveAlerts((alerts) => [...alerts, alert])
        setVisibleAlerts((alerts) => [...alerts, alert])
    }, [])
    const removeAlert = useCallback<(alertInfo: AcmAlertInfo) => void>((alertInfo: AcmAlertInfo) => {
        setActiveAlerts((activeAlerts) => {
            const index = activeAlerts.findIndex((ai) => ai.id === alertInfo.id)
            const newAlertInfos = [...activeAlerts]
            /* istanbul ignore else */
            if (index !== -1) newAlertInfos.splice(index, 1)
            return newAlertInfos
        })
    }, [])
    const removeVisibleAlert = useCallback<(alertInfo: AcmAlertInfo) => void>((alertInfo: AcmAlertInfo) => {
        setVisibleAlerts((alertInfos) => {
            const index = alertInfos.findIndex((ai) => ai.id === alertInfo.id)
            const newAlertInfos = [...alertInfos]
            /* istanbul ignore else */
            if (index !== -1) newAlertInfos.splice(index, 1)
            return newAlertInfos
        })
    }, [])
    const clearAlerts = (matcher?: (alertInfo: AcmAlertInfo) => boolean) => {
        if (!matcher) {
            for (const alertInfo of [...activeAlerts]) {
                removeAlert(alertInfo)
            }
        } else {
            const removeAlerts = activeAlerts.filter(matcher)
            for (const alertInfo of removeAlerts) {
                removeAlert(alertInfo)
            }
        }
    }
    return (
        <AcmAlertContext.Provider
            value={{
                activeAlerts: activeAlerts,
                alertInfos: visibleAlerts,
                addAlert,
                removeAlert,
                removeVisibleAlert,
                clearAlerts,
            }}
        >
            {props.children}
        </AcmAlertContext.Provider>
    )
}

export function AcmAlert(props: {
    alertInfo?: AcmAlertInfo
    isInline?: boolean
    title?: ReactNode
    subtitle?: ReactNode
    message?: ReactNode
    noClose?: boolean
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default'
    style?: CSSProperties
}) {
    const alertContext = useContext(AcmAlertContext)
    const { alertInfo } = props
    const [open, setOpen] = useState(false)
    useEffect(() => setOpen(true), [])
    useEffect(() => {
        if (alertInfo && !alertContext.activeAlerts.find((a) => a.id === alertInfo.id)) {
            setOpen(false)
        }
    }, [alertContext])
    return (
        <Collapse
            in={open}
            onExit={() => {
                /* istanbul ignore else */
                if (alertInfo) {
                    setTimeout(() => {
                        alertContext.removeAlert(alertInfo)
                        alertContext.removeVisibleAlert(alertInfo)
                    }, 200)
                }
            }}
            timeout={200}
        >
            <Alert
                isInline={props.isInline}
                title={alertInfo?.title || props.title}
                actionClose={!props.noClose && <AlertActionCloseButton onClose={() => setOpen(false)} />}
                variant={alertInfo?.type || props.variant}
                style={props.style}
            >
                {alertInfo?.message || props.message || props.subtitle}
            </Alert>
        </Collapse>
    )
}

export function AcmAlertGroup(props: { isInline?: boolean; canClose?: boolean }) {
    const alertContext = useContext(AcmAlertContext)
    return alertContext.alertInfos.length > 0 ? (
        <Fragment>
            {alertContext.alertInfos.map((alertInfo) => {
                return (
                    <AcmAlert
                        key={alertInfo.id}
                        alertInfo={alertInfo}
                        isInline={props.isInline}
                        noClose={!props.canClose}
                        style={{
                            marginBottom: '24px',
                        }}
                    />
                )
            })}
        </Fragment>
    ) : (
        <></>
    )
}
