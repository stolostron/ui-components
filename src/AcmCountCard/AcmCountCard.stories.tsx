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

const cardActions = [{ text: 'Share' }]

export const Card = () => {
    return (
        <AcmCountCard
            cardHeader={{
                title: 'Workloads',
                description: 'A pre-defined search to help you review your workloads',
                actions: [...cardActions],
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

export const CardSkeleton = () => loadingCard({ id: 'ACM Skeleton Card' })
