/* Copyright Contributors to the Open Cluster Management project */

import { makeStyles } from '@material-ui/core'
import { JumpLinks, JumpLinksItem, PopoverProps, Text, TextContent, TextVariants } from '@patternfly/react-core'
import React from 'react'
import { useViewport } from '../AcmCharts/AcmChartGroup'
import { AcmInlineStatus, StatusType } from '../AcmInlineStatus/AcmInlineStatus'

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
    /* istanbul ignore next */
    container: {
        marginTop: '24px',
    },
    text: {
        display: 'flex',
    },
})

export function AcmProgressTracker(props: AcmProgressTrackerProps) {
    const { viewWidth } = useViewport()
    const classes = useStyles(viewWidth)
    return (
        <div>
            <TextContent>
                <Text component={TextVariants.h3} style={{ fontWeight: 300 }}>
                    {props.title}
                </Text>
            </TextContent>
            <TextContent style={{ marginTop: '6px' }}>
                <Text component={TextVariants.small}>{props.message}</Text>
            </TextContent>
            <div className={classes.container}>
                <JumpLinks isVertical={viewWidth < 700} isCentered>
                    {props.steps.map((step, index) => (
                        <JumpLinksItem isActive={step.active} key={index}>
                            <TextContent>
                                <Text className={classes.text}>
                                    <AcmInlineStatus
                                        type={step.statusType}
                                        status={step.statusText}
                                        popover={step.popover}
                                    />
                                </Text>
                            </TextContent>
                        </JumpLinksItem>
                    ))}
                </JumpLinks>
            </div>
        </div>
    )
}
