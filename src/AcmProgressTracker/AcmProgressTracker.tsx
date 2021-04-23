/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { Text, TextContent, TextVariants, PopoverProps } from '@patternfly/react-core'
import { AcmInlineStatus, StatusType } from '../AcmInlineStatus/AcmInlineStatus'
import { makeStyles } from '@material-ui/core'
import { useViewport } from '../AcmCharts/AcmChartGroup'

export type AcmProgressTrackerProps = {
    title: string | React.ReactNode
    message: string | React.ReactNode
    steps: ProgressTrackerStep[]
}

export type ProgressTrackerStep = {
    active: boolean
    statusType: StatusType
    statusText: string | React.ReactNode
    popover?: PopoverProps
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: (viewWidth) => viewWidth > 414 ? 'row' : 'column', 
        marginTop: '24px',
    },
    active: {
        borderTop: (viewWidth) => viewWidth > 414 ? '3px solid var(--pf-global--active-color--100)' : '',
        borderLeft: (viewWidth) => viewWidth < 414 ? '3px solid var(--pf-global--active-color--100)' : '',
        height: (viewWidth) => viewWidth > 414 ? '56px' : '84px',
        flex: (viewWidth) => viewWidth > 414 ? 1 : '',
        display: 'flex',
        alignItems: 'center',
        '& div': {
            marginLeft: '3px',
        },
    },
    inactive: {
        borderTop: (viewWidth) => viewWidth > 414 ? '1px solid var(--pf-global--BorderColor--100)' : '',
        borderLeft: (viewWidth) => viewWidth < 414 ? '1px solid var(--pf-global--BorderColor--100)' : '',
        height: (viewWidth) => viewWidth > 414 ? '56px' : '84px',
        flex: (viewWidth) => viewWidth > 414 ? 1 : '',
        display: 'flex',
        alignItems: 'center',
        '& svg, span': {
            color: 'var(--pf-global--disabled-color--100)',
        },
        '& div': {
            marginLeft: '3px',
        },
    },
})

export function AcmProgressTracker(props: AcmProgressTrackerProps) {
    const { viewWidth } = useViewport()
    const classes = useStyles(viewWidth)
    return (
        <div>
            <TextContent>
                <Text component={TextVariants.h3} style={{ fontWeight: 300 }}>{props.title}</Text>
            </TextContent>
            <TextContent style={{ marginTop: '6px' }}>
                <Text component={TextVariants.small}>{props.message}</Text>
            </TextContent>

            <div className={classes.container}>
                {props.steps.map((step, index) => (
                    <div key={index} className={step.active ? classes.active : classes.inactive}>
                        <AcmInlineStatus type={step.statusType} status={step.statusText} popover={step.popover} />
                    </div>
                ))}
            </div>
        </div>
    )
}
