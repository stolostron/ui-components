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
    return (
        <AcmExpandableWrapper card={true} headerLabel={'wrapper label'}>
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
                onCardClick={() => console.log('cardclicked')}
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
                onCardClick={() => console.log('cardclicked')}
                count={0}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 3',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={() => console.log('cardclicked')}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 4',
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
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 5',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={() => console.log('cardclicked')}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 6',
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
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 7',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [...savedSearchCardActions],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={() => console.log('cardclicked')}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 8',
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
        </AcmExpandableWrapper>
    )
}

export const ExpandableRelatedResWrapper = () => {
    return (
        <AcmExpandableWrapper headerLabel={'wrapper label'}>
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 1, kind: 'veryShort' }}
            />
            <AcmTile
                loading={false}
                isSelected={false}
                title={''}
                onClick={() => console.log('tile clicked')}
                relatedResourceData={{ count: 99999, kind: 'veryLongKindNameForTestingPurposes' }}
            />
        </AcmExpandableWrapper>
    )
}
