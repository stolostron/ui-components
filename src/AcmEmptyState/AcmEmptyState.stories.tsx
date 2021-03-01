/* Copyright Contributors to the Open Cluster Management project */

import { Button } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmEmptyState } from './AcmEmptyState'

export default {
    title: 'EmptyState',
    component: AcmEmptyState,
}

export const EmptyState = () => (
    <AcmEmptyState
        title="No items found"
        message="You don't have any items yet."
        action={<Button variant="primary">Create Item</Button>}
    />
)
