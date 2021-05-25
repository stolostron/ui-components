/* Copyright Contributors to the Open Cluster Management project */

import { makeStyles } from '@material-ui/core'
import { Gallery, GalleryItem, PopoverProps, Text, TextContent } from '@patternfly/react-core'
import React, { Fragment } from 'react'
import { useViewport } from '../AcmCharts/AcmChartGroup'
import { ClassNameMap } from '@material-ui/styles'
import { AcmInlineStatus } from '../AcmInlineStatus'

export type AcmProgressTrackerProps = {
    steps: ProgressTrackerStep[]
    isCentered?: boolean
    Title: string
    Subtitle: string
    isStatusPopover?: boolean
    isStacked?: boolean
}

export type ProgressTrackerStep = {
    statusType: StatusType
    statusText: string | React.ReactNode
    popover?: PopoverProps
    statusSubtitle?: string
}

enum StatusType {
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

const divider = (classes: ClassNameMap) => {
    return (
        <svg className={classes.divider}>
            <line
                x1="0"
                x2="100"
                y1="10"
                y2="10"
                stroke="#D2D2D2" // --pf-global--palette--black-300
                strokeWidth="2"
                strokeLinecap="square"
                strokeDasharray="1, 3"
            />
        </svg>
    )
}

export function AcmProgressTracker(props: AcmProgressTrackerProps) {
    const classes = useStyles()
    const { viewWidth } = useViewport()
    const isStacked = props.isStacked || viewWidth < 700

    return (
        <Fragment>
            <TextContent>
                <Text component="h3">{props.Title}</Text>
                <Text component="small">{props.Subtitle}</Text>
            </TextContent>

            <Gallery className={isStacked ? classes.popoverParentContainer : classes.parentContainer}>
                {props.steps.map((step, index) => (
                    <GalleryItem key={index} className={classes.stepContainer}>
                        <div>
                            <AcmInlineStatus type={step.statusType} status={step.statusText} />
                            <TextContent>
                                <Text className={classes.stepStatus} component="small">
                                    {step.statusSubtitle}
                                </Text>
                            </TextContent>
                        </div>
                        {!isStacked && index < props.steps.length - 1 && divider(classes)}
                    </GalleryItem>
                ))}
            </Gallery>
        </Fragment>
    )
}
