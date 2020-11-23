import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmCountCard } from './AcmCountCard'

const meta: Meta = {
    title: 'Count Card',
    component: AcmCountCard,
}
export default meta

const handleCardClick = () => {
    console.log('Card clicked')
}

const suggestedSearchCardActions = [{ text: 'Share', handleAction: () => console.log('share action') }]
const savedSearchCardActions = [
    { text: 'Edit', handleAction: () => console.log('edit action') },
    { text: 'Share', handleAction: () => console.log('share action') },
    { text: 'Delete', handleAction: () => console.log('delete action') },
]

export const SuggestedSearchCard = () => {
    return (
        <div style={{ display: 'flex' }}>
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
                count={13000}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: true,
                    title: 'Unhealthy Pods',
                    description: 'Show pods with unhealthy status',
                    actions: [...suggestedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={0}
                countTitle="Unhealthy"
                isSelectable={true}
            />
        </div>
    )
}

export const SavedSearchCard = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 1',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={handleCardClick}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 2',
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
        </div>
    )
}

export const ClustersOverview = () => {
    return (
        <AcmCountCard
            count={0}
            countTitle="Nodes"
            cardFooter={{
                countDescription: '0 nodes inactive',
                countLink: null,
            }}
        />
    )
}

export const CardSkeleton = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AcmCountCard loading />
            <AcmCountCard loading />
            <AcmCountCard loading />
        </div>
    )
}
