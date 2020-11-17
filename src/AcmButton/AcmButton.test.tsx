import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmButton } from './AcmButton'

describe('AcmButton', () => {
    test('renders', () => {
        const { getByText } = render(<AcmButton onClick={() => null}>Button Label</AcmButton>)
        expect(getByText('Button Label')).toBeInTheDocument()
        expect(getByText('Button Label')).toBeInstanceOf(HTMLButtonElement)
    })
    test('renders with tooltip', () => {
        const { getByText } = render(
            <AcmButton onClick={() => null} isDisabled={true} tooltip="Tooltip text">
                Button Label
            </AcmButton>
        )
        userEvent.hover(getByText('Button Label'))
        waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmButton onClick={() => null}>Button Label</AcmButton>)
        expect(await axe(container)).toHaveNoViolations()
    })
})
