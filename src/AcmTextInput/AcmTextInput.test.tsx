import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmTextInput } from './AcmTextInput'

describe('AcmTextInput', () => {
    const TextInput = () => <AcmTextInput label="ACM text input" id="text-input" value="foobar" onChange={() => null} />
    const PasswordInput = () => (
        <AcmTextInput label="ACM text input" id="text-input" value="foobar" onChange={() => null} secret={true} />
    )

    test('renders', () => {
        const { getByText, getByLabelText } = render(<TextInput />)
        expect(getByText('ACM text input')).toBeInTheDocument()
        expect(getByLabelText('ACM text input')).toBeInstanceOf(HTMLInputElement)
    })
    test('renders as a password input', () => {
        const { getByLabelText } = render(<PasswordInput />)
        expect(getByLabelText('ACM text input')).toHaveAttribute('type', 'password')
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<TextInput />)
        expect(await axe(container)).toHaveNoViolations()
    })
})
