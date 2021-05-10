/* Copyright Contributors to the Open Cluster Management project */

import { makeStyles } from '@material-ui/core'
import { PopoverProps, Text, TextContent } from '@patternfly/react-core'
import React from 'react'
import { useViewport } from '../AcmCharts/AcmChartGroup'
import { AcmInlineStatus, StatusType } from '../AcmInlineStatus/AcmInlineStatus'

export type AcmProgressTrackerProps = {
    steps: ProgressTrackerStep[]
    isCentered?: boolean
}

export type ProgressTrackerStep = {
    active: boolean
    statusType: StatusType
    statusText: string | React.ReactNode
    popover?: PopoverProps
}

const useStyles = makeStyles({
    /* istanbul ignore next */
    parentContainer: {
        display: 'flex',
        paddingTop: '10px',
    },
    container: {
        display: 'inline-flex',
    },
    text: { width: 'max-content' },
    statusBox: {
        // display:'flex'
    },
    divider: {
        padding: '0px 40px 0px 40px',
        maxWidth: '180px',
        maxHeight: '20px',
    },
    stepStatus: {
        paddingLeft:'25px',
    }
})

const divider = () => {
    const { viewWidth } = useViewport()
    const classes = useStyles(viewWidth)
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

export function AcmProgressTracker(props: AcmProgressTrackerProps) {
    const { viewWidth } = useViewport()
    const classes = useStyles(viewWidth)
    return (
        <div>
            <TextContent>
                <Text component="h3">Title</Text>
                <Text component="small">Subtitle</Text>
            </TextContent>
            <div>
                <div className={classes.parentContainer}>
                    {props.steps.map((step, index) => (
                        <div className={classes.container}>
                            <div className={classes.statusBox}>
                                <TextContent>
                                    <AcmInlineStatus
                                        type={step.statusType}
                                        status={step.statusText}
                                        popover={step.popover}
                                    />
                                   <Text className={classes.stepStatus} component='small'>Status</Text>
                                </TextContent>
                            </div>
                            {index < props.steps.length - 1 && divider()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
