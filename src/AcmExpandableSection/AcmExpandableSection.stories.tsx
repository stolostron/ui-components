import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmExpandableSection } from './AcmExpandableSection'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'ExpandableSection',
    component: AcmExpandableSection,
}

export const ExpandableSection = () => (
    <AcmPage>
        <AcmPageHeader title="AcmExpandable"></AcmPageHeader>
        <AcmPageCard>
            <AcmExpandableSection label="Expandable Label">Expandable Content</AcmExpandableSection>
        </AcmPageCard>
    </AcmPage>
)
