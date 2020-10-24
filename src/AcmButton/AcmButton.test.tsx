import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmButton } from './AcmButton'

describe('AcmButton', () => {
    test('renders', () => {
        const { getByText } = render(<AcmButton onClick={() => null}>Button Label</AcmButton>)
        expect(getByText('Button Label')).toBeInTheDocument()
        expect(getByText('Button Label')).toBeInstanceOf(HTMLButtonElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmButton onClick={() => null}>Button Label</AcmButton>)
        expect(await axe(container)).toHaveNoViolations()
    })
})
