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
}

export interface IAlertContext {
    readonly alertInfos: AcmAlertInfo[]
    addAlert: (alertInfo: AcmAlertInfo) => void
    removeAlert: (alertInfo: AcmAlertInfo) => void
    clearAlerts: () => void
    readonly clear: number
}

/* istanbul ignore next */
const noop = () => null

export const AcmAlertContext = createContext<IAlertContext>({
    alertInfos: [],
    addAlert: noop,
    removeAlert: noop,
    clearAlerts: noop,
    clear: 0,
})

export function AcmAlertProvider(props: { children: ReactNode }) {
    const [alertInfos, setAlertInfos] = useState<AcmAlertInfo[]>([])
    const [clear, setClear] = useState(0)
    const addAlert = useCallback<(alertInfo: AcmAlertInfo) => void>((alertInfo: AcmAlertInfo) => {
        alertInfo.id = Math.random().toString(36).substring(7)
        setAlertInfos((alertInfos) => [...alertInfos, alertInfo])
    }, [])
    const removeAlert = useCallback<(alertInfo: AcmAlertInfo) => void>((alertInfo: AcmAlertInfo) => {
        setAlertInfos((alertInfos) => {
            const index = alertInfos.findIndex((ai) => ai.id === alertInfo.id)
            const newAlertInfos = [...alertInfos]
            /* istanbul ignore else */
            if (index !== -1) newAlertInfos.splice(index, 1)
            return newAlertInfos
        })
    }, [])
    const clearAlerts = useCallback<() => void>(() => setClear((clear) => clear + 1), [])
    return (
        <AcmAlertContext.Provider value={{ alertInfos, addAlert, removeAlert, clearAlerts, clear }}>
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
    const [clear] = useState(alertContext.clear)
    useEffect(() => setOpen(true), [])
    useEffect(() => {
        if (clear !== alertContext.clear) setOpen(false)
    }, [alertContext])
    return (
        <Collapse
            in={open}
            onExit={() => {
                /* istanbul ignore else */
                if (alertInfo) {
                    setTimeout(() => alertContext.removeAlert(alertInfo), 200)
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
