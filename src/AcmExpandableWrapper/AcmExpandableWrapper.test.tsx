import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
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

    test('has zero accessibility defects', async () => {
        const { container } = render(savedSearchWrapper())
        expect(await axe(container)).toHaveNoViolations()
    })

    test('validates expandable wrapper renders in collapsed state', () => {
        const { getByText, container } = render(savedSearchWrapper())
        expect(getByText('wrapper label')).toBeInTheDocument()
        expect(container.querySelector('.pf-c-button')).toBeInTheDocument()
    })

    test('toggles showAll button', () => {
        const { getByRole, getByText } = render(savedSearchWrapper())
        userEvent.click(getByRole('button'))
        expect(getByText('Show less')).toBeInTheDocument()
    })
})
