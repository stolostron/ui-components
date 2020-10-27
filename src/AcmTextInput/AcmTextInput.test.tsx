import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmTextInput } from './AcmTextInput'

describe('AcmTextInput', () => {
    const TextInput = () => <AcmTextInput label="ACM text input" id="text-input" value="foobar" onChange={() => null} />

    test('renders', () => {
        const { getByText, getByLabelText } = render(<TextInput />)
        expect(getByText('ACM text input')).toBeInTheDocument()
        expect(getByLabelText('ACM text input')).toBeInstanceOf(HTMLInputElement)
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<TextInput />)
        expect(await axe(container)).toHaveNoViolations()
    })
})
