import { SelectOption } from '@patternfly/react-core'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React, { useState } from 'react'
import { AcmForm, AcmSubmit } from '../AcmForm/AcmForm'
import { AcmSelect } from './AcmSelect'

describe('AcmSelect', () => {
    const Select = () => {
        const [value, setValue] = useState<string>()
        return (
            <AcmSelect
                id="acm-select"
                label="ACM select"
                value={value}
                onChange={setValue}
                placeholderText="Select one"
            >
                <SelectOption value="red" />
                <SelectOption value="green" />
            </AcmSelect>
        )
    }

    // test('can apply and clear selections', () => {
    //     const { getByTestId, getByRole, queryByText, getByText, queryByTestId } = render(<Select />)
    //     userEvent.click(getByRole('button'))

    //     expect(getByTestId('acm-select')).toBeVisible()
    //     expect(getByText('bar')).toBeVisible()
    //     userEvent.click(getByText('bar'))

    //     expect(queryByTestId('acm-select')).toBeNull()
    //     expect(getByText('bar')).toBeVisible()

    //     userEvent.click(getByRole('button', { name: 'Clear all' }))
    //     expect(queryByText('bar')).toBeNull()
    // })

    test('has zero accessibility defects', async () => {
        const { getByRole, container } = render(<Select />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getByRole('button'))
        expect(await axe(container)).toHaveNoViolations()
    })

    test('validates required input', async () => {
        const Component = () => {
            const [value, setValue] = useState<string | undefined>(undefined)
            return (
                <AcmForm>
                    <AcmSelect id="input" label="label" value={value} onChange={setValue} isRequired>
                        <SelectOption value="red">Red</SelectOption>
                        <SelectOption value="green">Green</SelectOption>
                    </AcmSelect>
                    <AcmSubmit>Submit</AcmSubmit>
                </AcmForm>
            )
        }
        const { getByText, getByTestId, getAllByRole } = render(<Component />)
        expect(getByTestId('input-label')).not.toContainHTML('pf-m-error')
        getByText('Submit').click()
        expect(getByTestId('input-label')).toContainHTML('pf-m-error')
        getByTestId('pf-select-toggle-id-5').click()
        getAllByRole('option')[0].click()
        expect(getByTestId('input-label')).not.toContainHTML('pf-m-error')
    })

    // test('validates using function', async () => {
    //     const Component = () => {
    //         const [value, setValue] = useState<string>('')
    //         return (
    //             <AcmForm>
    //                 <AcmSelect
    //                     id="input"
    //                     label="label"
    //                     selections={value}
    //                     onSelect={(_e, v) => {
    //                         setValue(v as string)
    //                     }}
    //                     validation={(value: unknown) => {
    //                         if (typeof value === 'string' && value.length < 8)
    //                             return 'Field must be at least 8 characters.'
    //                         return undefined
    //                     }}
    //                 />
    //                 <AcmSubmit>Submit</AcmSubmit>
    //             </AcmForm>
    //         )
    //     }

    //     const { getByText, getByTestId } = render(<Component />)
    //     expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'false')
    //     getByText('Submit').click()
    //     expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
    //     expect(getByTestId('input-helper')).toBeInTheDocument()
    //     expect(getByTestId('input-helper')).toContainHTML('Field must be at least 8 characters.')
    //     userEvent.type(getByTestId('input'), '12345678')
    //     expect(getByTestId('input')).toHaveAttribute('aria-invalid', 'false')
    // })
})
