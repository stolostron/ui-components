import React, { useState } from 'react'
import { render, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmForm, AcmSubmit } from './AcmForm'
import { AcmTextInput } from '../AcmTextInput/AcmTextInput'
import userEvent from '@testing-library/user-event'

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

    test('supports validation', async () => {
        const mockClickCallback = jest.fn()
        const mockClickPromise = () => {
            mockClickCallback()
            return Promise.resolve()
        }

        const Component = () => {
            const [value, setValue] = useState<string>('')
            return (
                <AcmForm>
                    <AcmTextInput id="input" label="Input" isRequired value={value} onChange={setValue} />
                    <AcmSubmit onClick={mockClickPromise}>Submit</AcmSubmit>
                </AcmForm>
            )
        }
        const { getByText, getByTestId } = render(<Component />)

        expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'false')
        expect(getByText('Submit')).not.toHaveAttribute('disabled')

        expect(mockClickCallback).not.toHaveBeenCalled()
        getByText('Submit').click()
        expect(mockClickCallback).not.toHaveBeenCalled()

        expect(getByText('Submit')).toHaveAttribute('disabled')
        expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'true')

        userEvent.type(getByTestId('input'), 'Hello')

        expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'false')
        expect(getByText('Submit')).not.toHaveAttribute('disabled')

        expect(mockClickCallback).not.toHaveBeenCalled()
        getByText('Submit').click()
        expect(mockClickCallback).toHaveBeenCalled()

        userEvent.clear(getByTestId('input'))

        waitFor(() => expect(getByText('Submit')).toHaveAttribute('disabled'))
        waitFor(() => expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'true'))
    })
})
