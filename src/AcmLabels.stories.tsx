import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLabels } from './AcmLabels'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'

export default {
    title: 'AcmLabels',
    component: AcmLabels,
}

export const Labels = () => (
    <AcmPage>
        <AcmPageHeader title="AcmLabels"></AcmPageHeader>
        <AcmPageCard>
            <AcmLabels labels={['abc=123', 'test']} />
        </AcmPageCard>
    </AcmPage>
)
