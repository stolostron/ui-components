import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLoadingTable } from './AcmTableLoading'

export default {
    title: 'LoadingTable',
    component: AcmLoadingTable,
    excludeStories: ['exampleData'],
}

export function TableLoading() {
    return <AcmLoadingTable />
}
