import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcmFormSection } from './AcmFormSection'

describe('AcmFormSection', () => {
    test('renders', () => {
        const { getByText } = render(<AcmFormSection title="TITLE" addSpacing />)
        expect(getByText('TITLE')).toBeInTheDocument()
    })

    test('renders with tooltip', async () => {
        const { getByText, getByTestId } = render(<AcmFormSection id="section" title="TITLE" tooltip="TOOLTIP" />)
        userEvent.tab()
        userEvent.hover(getByText('TITLE'))
        expect(getByTestId('section-label-help-button')).toHaveFocus()
        waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
        userEvent.unhover(getByTestId('section-label-help-button'))
        waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
        await new Promise((resolve) => setTimeout(resolve, 0))
    })
})
