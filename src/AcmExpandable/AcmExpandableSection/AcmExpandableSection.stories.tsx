import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmExpandableSection } from './AcmExpandableSection'

export default {
    title: 'Expandable',
    component: AcmExpandableSection,
}

export const ExpandableSection = () => (
    <AcmExpandableSection label="Expandable Label">Expandable Content</AcmExpandableSection>
)
