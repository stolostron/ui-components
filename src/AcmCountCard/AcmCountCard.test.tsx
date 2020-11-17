import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmCountCard } from './AcmCountCard'

describe('AcmCountCard', () => {
    const shareAction = jest.fn()
    const cardAction = jest.fn()

    // Skeleton Card Tests

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

    // Suggested Search Card Tests

    const SuggestedSearchCard = () => (
        <AcmCountCard
            id="ACM Suggested Search Card"
            cardHeader={{
                title: 'Workloads',
                description: 'A pre-defined search to help you review your workloads',
                actions: [{ text: 'Share' }],
                onActionClick: () => {
                    shareAction()
                },
            }}
            onClick={cardAction()}
            count={0}
            countTitle="Results"
            isSelectable={true}
        />
    )

    test('has zero accessibility defects', async () => {
        const { container, getAllByLabelText } = render(<SuggestedSearchCard />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getAllByLabelText('Actions')[0])
        expect(await axe(container)).toHaveNoViolations()
    })

    test('validates ACM Suggested Search Card renders and is clickable', () => {
        const { getByTestId } = render(<SuggestedSearchCard />)
        expect(getByTestId('ACM Suggested Search Card')).toBeInTheDocument()
        userEvent.click(getByTestId('ACM Suggested Search Card'))
        expect(cardAction).toHaveBeenCalled()
    })

    test('supports single menu action', () => {
        const { getAllByLabelText, getByText } = render(<SuggestedSearchCard />)
        expect(getAllByLabelText('Actions')).toHaveLength(1)
        userEvent.click(getAllByLabelText('Actions')[0])
        expect(getByText('Share')).toBeVisible()
        userEvent.click(getByText('Share'))
        expect(shareAction).toHaveBeenCalled()
    })

    // Saved Search Card Tests

    const SavedSearchCard = () => (
        <AcmCountCard
            id="ACM Saved Search Card"
            cardHeader={{
                title: 'Kind:pod',
                description: 'A pre-defined search to help you review your workloads',
                actions: [{ text: 'Edit' }, { text: 'Share' }, { text: 'Delete' }],
                onActionClick: () => {
                    shareAction()
                },
                hasIcon: true,
            }}
            onClick={cardAction()}
            count={0}
            countTitle="Results"
            isSelectable={true}
        />
    )

    test('has zero accessibility defects', async () => {
        const { container, getAllByLabelText } = render(<SavedSearchCard />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getAllByLabelText('Actions')[0])
        expect(await axe(container)).toHaveNoViolations()
    })

    test('validates ACM Saved Search Card renders and is clickable', () => {
        const { getByTestId, getAllByLabelText } = render(<SavedSearchCard />)
        expect(getByTestId('ACM Saved Search Card')).toBeInTheDocument()
        expect(getAllByLabelText('Actions')).toHaveLength(1)
    })
})
