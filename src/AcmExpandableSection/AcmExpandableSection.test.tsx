import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcmExpandableSection } from './AcmExpandableSection'

describe('AcmExpandableSection', () => {
    test('renders in a collapsed state', () => {
        const { getByText, container } = render(
            <AcmExpandableSection label="Expandable Label" summary="Summary about this section">
                Section content
            </AcmExpandableSection>
        )
        expect(getByText('Expandable Label - Summary about this section')).toBeInTheDocument()
        expect(container.querySelector('.pf-c-expandable-section__content')).not.toBeVisible()
    })
    test('can be expanded', () => {
        const { getByRole, container } = render(
            <AcmExpandableSection label="Expandable Label" summary="Summary about this section">
                Section content
            </AcmExpandableSection>
        )
        userEvent.click(getByRole('button'))
        expect(container.querySelector('.pf-c-expandable-section__content')).toBeVisible()
    })
})
