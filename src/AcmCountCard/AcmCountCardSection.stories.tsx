import React from 'react'
import { AcmCountCardSection } from './AcmCountCardSection'

export default {
    title: 'Count Card',
    component: AcmCountCardSection,
}

export const CountCardSection = () => {
    const cards = [
        {
            id: 'nodes',
            count: 6,
            countClick: () => console.log('node count clicked'),
            title: 'Nodes',
            description: '0 nodes inactive',
        },
        {
            id: 'applications',
            count: 0,
            countClick: () => console.log('app count clicked'),
            title: 'Applications',
            linkText: 'Go to Applications',
            onLinkClick: () => console.log('app link clicked'),
        },
        {
            id: 'violations',
            count: 5,
            countClick: () => console.log('violation count clicked'),
            title: 'Policy violations',
            linkText: 'Go to Policies',
            onLinkClicked: () => console.log('violation link clicked'),
            isDanger: true,
        },
    ]
    return <AcmCountCardSection title="Status" cards={cards} />
}
