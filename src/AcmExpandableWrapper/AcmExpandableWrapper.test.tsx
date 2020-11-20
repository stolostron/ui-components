import React from 'react'
import { render } from '@testing-library/react'
// import { axe } from 'jest-axe'
import { AcmCountCard } from '../AcmCountCard/AcmCountCard'
import { AcmExpandableWrapper } from '../AcmExpandableWrapper/AcmExpandableWrapper'

describe('AcmExpandableWrapper', () => {
    const savedSearchWrapper = () => (
        <AcmExpandableWrapper headerLabel={'wrapper label'}>
            <AcmCountCard
                cardHeader={{
                    hasIcon: false,
                    title: 'Test Search 1',
                    description: 'Custom description with max amount of 60 characters',
                    actions: [],
                    onActionClick: (e) => {
                        console.log(e.target)
                    },
                }}
                onCardClick={() => console.log('cardclicked')}
                count={1234}
                countTitle="Results"
                isSelectable={true}
            />
        </AcmExpandableWrapper>
    )

    test('validates expandable wrapper renders', () => {
        const { getByText } = render(savedSearchWrapper())
        expect(getByText('wrapper label')).toBeInTheDocument()
    })

    // test('toggles showAll button', () => {
    //     const {getByText} = render(savedSearchWrapper())

    // })
})
