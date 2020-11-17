import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmCountCard, loadingCard } from './AcmCountCard'

const meta: Meta = {
    title: 'Count Card',
    component: AcmCountCard,
}
export default meta

const handleCardClick = () => {
    console.log('Card clicked')
}

const suggestedSearchCardActions = [{ text: 'share' }]
const savedSearchCardActions = [{ text: 'edit' }, { text: 'share' }, { text: 'delete' }]

export const SuggestedSearchCard = () => {
    return (
        <AcmCountCard
            cardHeader={{
                hasIcon: true,
                title: 'Workloads',
                description: 'A pre-defined search to help you review your workloads',
                actions: [...suggestedSearchCardActions],
                onActionClick: (e) => {
                    console.log(e.target)
                },
            }}
            onCardClick={handleCardClick}
            count={0}
            countTitle="Results"
            isSelectable={true}
        />
    )
}

export const SavedSearchCard = () => {
    return (
        <AcmCountCard
            cardHeader={{
                hasIcon: false,
                title: 'Test Search',
                description: 'Custom description with max amount of 60 characters',
                actions: [...savedSearchCardActions],
                onActionClick: (e) => {
                    console.log(e.target)
                },
            }}
            onCardClick={handleCardClick}
            count={0}
            countTitle="Results"
            isSelectable={true}
        />
    )
}

// export const ClustersOverview = () => {
//     return (
//         <AcmCountCard
//             count={2}
//             countTitle="Nodes"
//             cardFooter={{
//                 countDescription: {count?},
//                 countLink: null,
//             }}
//         />
//     )
// }

export const CardSkeleton = () => loadingCard({ id: 'ACM Skeleton Card' })
