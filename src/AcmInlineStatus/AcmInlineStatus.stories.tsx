import React from 'react'
import { Card, CardBody, Popover, Button } from '@patternfly/react-core'
import { AcmInlineStatus, StatusType } from './AcmInlineStatus'

export default {
    title: 'InlineStatus',
    component: AcmInlineStatus,
    argTypes: {
        type: {
            control: { type: 'select', options: Object.values(StatusType) },
        },
        status: { type: 'string' },
    },
}

export const InlineStatus = (args) => {
    return (
        <Card>
            <CardBody>
                <AcmInlineStatus type={args.type} status={args.status} />
            </CardBody>
        </Card>
    )
}
InlineStatus.args = {
    status: 'Ready',
    type: StatusType.healthy,
}
