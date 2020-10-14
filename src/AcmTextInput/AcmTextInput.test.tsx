import React from 'react'
import { render } from '@testing-library/react'
import { AcmTextInput } from './AcmTextInput'

describe('AcmTextInput', () => {
    test('renders', () => {
        const { getByText, getByLabelText } = render(
            <AcmTextInput label="ACM text input" id="text-input" value="foobar" onChange={() => null} />
        )
        expect(getByText('ACM text input')).toBeInTheDocument()
        expect(getByLabelText('ACM text input')).toBeInstanceOf(HTMLInputElement)
    })
    test('renders as a password input', () => {
        const { getByLabelText } = render(
            <AcmTextInput secret label="ACM text input" id="text-input" value="foobar" onChange={() => null} />
        )
        expect(getByLabelText('ACM text input')).toHaveAttribute('type', 'password')
    })
})
