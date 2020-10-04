import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmExpandable } from './AcmExpandable'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'

export default {
    title: 'AcmExpandable',
    component: AcmExpandable,
}

export const Expandable = () => (
    <AcmPage>
        <AcmPageHeader title="AcmExpandable"></AcmPageHeader>
        <AcmPageCard>
            <AcmExpandable label="Expandable Label">Expandable Content</AcmExpandable>
        </AcmPageCard>
    </AcmPage>
)
