import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmCountCard } from './AcmCountCard'

describe('AcmCountCard', () => {
    const SkeletonCard = () => {
        return <AcmCountCard id="ACM Skeleton Card" loading={true} />
    }

    test('validates Skeleton Card renders', () => {
        const { getByTestId } = render(<SkeletonCard />)
        expect(getByTestId('ACM Skeleton Card')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<SkeletonCard />)
        expect(await axe(container)).toHaveNoViolations
    })

    const shareAction = jest.fn()
    const SuggestedSearchCard = () => (
        <AcmCountCard
            id="ACM Card"
            cardHeader={{
                title: 'Workloads',
                description: 'A pre-defined search to help you review your workloads',
                actions: [{ text: 'Share' }],
                onActionClick: () => {
                    shareAction()
                },
            }}
            onCardClick={jest.fn()}
            count={0}
            countTitle="Results"
            isSelectable={true}
        />
    )
    test('validates ACM Suggested Search Card renders', () => {
        const { getByTestId } = render(<SuggestedSearchCard />)
        expect(getByTestId('ACM Card')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container, getAllByLabelText } = render(<SuggestedSearchCard />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getAllByLabelText('Actions')[0])
        expect(await axe(container)).toHaveNoViolations()
    })

    test('supports single menu action', () => {
        const { getAllByLabelText, getByText, getByRole } = render(<SuggestedSearchCard />)
        expect(getAllByLabelText('Actions')).toHaveLength(1)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByRole('menu')).toBeVisible()
        expect(getByText('Share')).toBeVisible()
        userEvent.click(getByText('Share'))
        expect(shareAction).toHaveBeenCalled()
        expect(getByText('pf-m-expanded dropdownMenu')).not.toBeInTheDocument()
    })

    //     test('validates using function on card click', () => {
    //     const { getByText } = render(<SuggestedSearchCard />)
    // }
    // test('renders', () => {
    //     const { getByText } = render(<LoadingCard />)
    //     expect(getByText('ACM card'))
    // })
})
