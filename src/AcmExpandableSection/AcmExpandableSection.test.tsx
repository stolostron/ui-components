import React from 'react'
import { render } from '@testing-library/react'
import { AcmExpandableSection } from './AcmExpandableSection'

describe('AcmExpandableSection', () => {
    test('renders', () => {
        const { getByText } = render(
            <AcmExpandableSection label="Expandable Label" summary="Summary about this section">
                Section content
            </AcmExpandableSection>
        )
        expect(getByText('Expandable Label - Summary about this section')).toBeInTheDocument()
        expect(getByText('Section content')).toBeInstanceOf(HTMLDivElement)
    })
})
