import React from 'react'
import { render } from '@testing-library/react'
import { AcmForm } from './AcmForm'

describe('AcmForm', () => {
    test('renders', () => {
        const { getByText } = render(<AcmForm>ACM form here</AcmForm>)
        expect(getByText('ACM form here')).toBeInTheDocument()
        expect(getByText('ACM form here')).toBeInstanceOf(HTMLFormElement)
    })
})
