import React from 'react'
import { render } from '@testing-library/react'
import { AcmButton } from './AcmButton'

describe('AcmButton', () => {
    test('renders', () => {
        const { getByText } = render(<AcmButton>Button Label</AcmButton>)
        expect(getByText('Button Label')).toBeInTheDocument()
        expect(getByText('Button Label')).toBeInstanceOf(HTMLButtonElement)
    })
})
