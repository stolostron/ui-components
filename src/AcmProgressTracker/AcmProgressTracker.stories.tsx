/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { AcmProgressTracker } from './AcmProgressTracker'
import { StatusType } from '../AcmInlineStatus/AcmInlineStatus'
import { Card, CardBody } from '@patternfly/react-core'

export default {
    title: 'ProgressTracker',
    component: AcmProgressTracker,
    // argTypes: {
    //     type: {
    //         control: { type: 'select', options: Object.values(StatusType) },
    //     },
    //     status: { type: 'string' },
    // },
}

export const ProgressTracker = () => {
    const steps = [
        {
            active: false,
            statusType: StatusType.healthy,
            statusText: 'Pre-creation jobs',
        },
        {
            active: true,
            statusType: StatusType.progress,
            statusText: 'Cluster install',
        },
        {
            active: false,
            statusType: StatusType.empty,
            statusText: 'Klusterlet install',
        },
        {
            active: false,
            statusType: StatusType.empty,
            statusText: 'Post-creation jobs',
        },
    ]
    return (
        <Card>
            <CardBody>
                <AcmProgressTracker title="Creating cluster" message="0 out of 4 steps completed" steps={steps} />
            </CardBody>
        </Card>
    )
}
