/* Copyright Contributors to the Open Cluster Management project */

import { Card, CardBody } from '@patternfly/react-core'
import React from 'react'
import { AcmInlineStatus, StatusType } from '../AcmInlineStatus/AcmInlineStatus'
import { AcmProgressTracker } from './AcmProgressTracker'

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
            statusSubtitle: 'Complete',
        },
        {
            active: true,
            statusType: StatusType.progress,
            statusText: 'Cluster install',
            statusSubtitle: 'Installing',
        },
        {
            active: false,
            statusType: StatusType.empty,
            statusText: 'Klusterlet install',
            statusSubtitle: 'Pending',
        },
    ]
    return (
        <div>
            <Card>
                <CardBody>
                    <AcmProgressTracker steps={steps} Title="Ansible Jobs" Subtitle="1 out of 3 steps complete" />
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <AcmInlineStatus
                        type={StatusType.progress}
                        status="Installing"
                        popover={{
                            bodyContent: (
                                <AcmProgressTracker
                                    isStacked={true}
                                    steps={steps}
                                    Title="Ansible Jobs"
                                    Subtitle="1 out of 3 steps complete"
                                />
                            ),
                        }}
                    />
                </CardBody>
            </Card>
        </div>
    )
}
