import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmForm } from './AcmForm'

describe('AcmForm', () => {
    test('renders', () => {
        const { getByText } = render(<AcmForm>ACM form here</AcmForm>)
        expect(getByText('ACM form here')).toBeInTheDocument()
        expect(getByText('ACM form here')).toBeInstanceOf(HTMLFormElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmForm>ACM form here</AcmForm>)
        expect(await axe(container)).toHaveNoViolations()
    })
})
