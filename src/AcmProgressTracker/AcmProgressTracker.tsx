/* Copyright Contributors to the Open Cluster Management project */

import { makeStyles } from '@material-ui/core'
import { Button, Popover, PopoverProps, Spinner, Text, TextContent } from '@patternfly/react-core'
import React from 'react'
import { useViewport } from '../AcmCharts/AcmChartGroup'
import {
    AsleepIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    MinusCircleIcon,
    UnknownIcon,
    ResourcesEmptyIcon,
} from '@patternfly/react-icons'

export type AcmProgressTrackerProps = {
    steps: ProgressTrackerStep[]
    isCentered?: boolean
    Title: String
    Subtitle: String
    isStatusPopover?: boolean
    isStacked?: boolean
}

export type ProgressTrackerStep = {
    active: boolean
    statusType: StatusType
    statusText: string | React.ReactNode
    popover?: PopoverProps
    statusSubtitle: string
}

export enum StatusType {
    'healthy' = 'healthy',
    'danger' = 'danger',
    'warning' = 'warning',
    'progress' = 'progress',
    'detached' = 'detached',
    'pending' = 'pending',
    'unknown' = 'unknown',
    'sleep' = 'sleep',
    'empty' = 'empty',
}

const useStyles = makeStyles({
    /* istanbul ignore next */
    parentContainer: {
        display: 'flex',
        paddingTop: '10px',
    },
    popoverParentContainer: {
        display: 'inline-grid',
    },
    popoverBody: {
        display: 'flex',
    },
    stepContainer: {
        display: 'inline-flex',
        padding: '10px 0px 10px 0px',
    },
    text: { width: 'max-content' },
    divider: {
        padding: '0px 40px 0px 40px',
        maxWidth: '180px',
        maxHeight: '20px',
    },
    stepStatus: {
        paddingLeft: '25px',
    },
    container: {
        display: 'flex',
    },
    icon: {
        width: '18px', // Progress size md is 18px
    },
    iconMargin: {
        margin: '3px 2px 1px 2px',
    },
    button: {
        padding: 0,
        fontSize: 'inherit',
    },
})

const divider = (isStacked: boolean) => {
    const classes = useStyles()
    if (isStacked) return undefined
    return (
        <svg className={classes.divider}>
            <line
                x1="0"
                x2="100"
                y1="10"
                y2="10"
                stroke="#D2D2D2" // --pf-global--palette--black-300
                stroke-width="2"
                stroke-linecap="square"
                stroke-dasharray="1, 3"
            />
        </svg>
    )
}

export function AcmProgressTrackerButton() {
    return <div></div>
}

export function AcmProgressTracker(props: AcmProgressTrackerProps) {
    const classes = useStyles()
    const { viewWidth } = useViewport()
    const isStacked = props.isStacked || viewWidth < 700

    return (
        <div>
            <TextContent>
                <Text component="h3">{props.Title}</Text>
                <Text component="small">{props.Subtitle}</Text>
            </TextContent>
            <div>
                <div className={isStacked ? classes.popoverParentContainer : classes.parentContainer}>
                    {props.steps.map((step, index) => (
                        <div className={classes.stepContainer}>
                            <div>
                                <InlineStatus type={step.statusType} status={step.statusText} popover={step.popover} />
                                <TextContent>
                                    <Text className={classes.stepStatus} component="small">
                                        {step.statusSubtitle}
                                    </Text>
                                </TextContent>
                            </div>
                            {index < props.steps.length - 1 && divider(isStacked)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function InlineStatus(props: { type: StatusType; status: string | React.ReactNode; popover?: PopoverProps }) {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <div className={classes.icon}>
                <StatusIcon type={props.type} />
            </div>
            <span style={{ marginLeft: '.4rem' }}>
                {props.popover ? (
                    <Popover hasAutoWidth {...props.popover}>
                        <Button variant="link" className={classes.button}>
                            {props.status}
                        </Button>
                    </Popover>
                ) : (
                    props.status
                )}
            </span>
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
        case StatusType.pending:
            return <MinusCircleIcon className={classes.iconMargin} color="var(--pf-global--disabled-color--100)" />
        case StatusType.sleep:
            return <AsleepIcon className={classes.iconMargin} color="var(--pf-global--palette--purple-500)" />
        case StatusType.empty:
            return <ResourcesEmptyIcon className={classes.iconMargin} color="var(--pf-global--disabled-color--100)" />
        case 'unknown':
        default:
            return <UnknownIcon className={classes.iconMargin} color="var(--pf-global--disabled-color--100)" />
    }
}
