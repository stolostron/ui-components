import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmEmptyState } from './AcmEmptyState'

export default {
    title: 'EmptyState',
    component: AcmEmptyState,
}

export const EmptyState = () => (
    <AcmEmptyState title="Nothing found" message="You do not have an items" action="Add item" />
)
