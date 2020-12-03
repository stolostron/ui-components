import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmExpandableWrapper } from './AcmExpandableWrapper'
import { AcmTile } from '../AcmTile/AcmTile'
import { AcmCountCard } from '../AcmCountCard/AcmCountCard'
const meta: Meta = {
    title: 'Expandable Wrapper',
    component: AcmExpandableWrapper,
}
export default meta

const savedSearchCardActions = [
    { text: 'Edit', handleAction: () => console.log('edit action') },
    { text: 'Share', handleAction: () => console.log('share action') },
    { text: 'Delete', handleAction: () => console.log('delete action') },
]

export const ExpandableSavedSearchWrapper = () => {
    const count = [1, 2, 3, 4, 5, 6, 7]
    const renderAcmCountCards = count.map((n) => {
        return (
            <AcmCountCard
                key={n}
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 2',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={() => console.log('cardclicked')}
                count={0}
                countTitle="Results"
                isSelectable={true}
            />
        )
    })
    return (
        <AcmExpandableWrapper maxHeight={'16rem'} headerLabel={'Saved Searches'} withCount={true}>
            {renderAcmCountCards}
        </AcmExpandableWrapper>
    )
}

export const ExpandableRelatedResWrapper = () => {
    const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const renderAcmTiles = count.map((n) => {
        return (
            <AcmTile
                key={n}
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
        )
    })
    return <AcmExpandableWrapper maxHeight={'9rem'}>{renderAcmTiles}</AcmExpandableWrapper>
}
