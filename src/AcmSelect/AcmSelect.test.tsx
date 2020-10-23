import React, { useState } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmSelect } from './AcmSelect'

describe('AcmSelect', () => {
    const Select = () => {
        const [value, setValue] = useState<string>()
        return (
            <AcmSelect
                id="acm-select"
                label="ACM select"
                onChange={setValue}
                options={['foo', 'bar']}
                value={value}
                placeholder="Select one"
                clear
            />
        )
    }
    test('renders with options of type: string', () => {
        const { getByText } = render(
            <AcmSelect id="acm-select" label="ACM select" onChange={() => null} options={['foo', 'bar']} value="foo" />
        )
        expect(getByText('ACM select')).toBeInTheDocument()
    })
    test('render with options of type: object', () => {
        const { getByText } = render(
            <AcmSelect
                id="acm-select"
                label="ACM select"
                onChange={() => null}
                options={[
                    { title: 'foo', value: 'isFoo' },
                    { title: 'bar', value: 'isBar' },
                ]}
                value="foo"
            />
        )
        expect(getByText('ACM select')).toBeInTheDocument()
    })
    test('can apply and clear selections', () => {
        const { getByTestId, getByRole, queryByText, getByText, queryByTestId } = render(<Select />)
        userEvent.click(getByRole('button'))

        expect(getByTestId('acm-select')).toBeVisible()
        expect(getByText('bar')).toBeVisible()
        userEvent.click(getByText('bar'))

        expect(queryByTestId('acm-select')).toBeNull()
        expect(getByText('bar')).toBeVisible()

        userEvent.click(getByRole('button', { name: 'Clear all' }))
        expect(queryByText('bar')).toBeNull()
    })
    test('has zero accessibility defects', async () => {
        const { getByRole, container } = render(<Select />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getByRole('button'))
        expect(await axe(container)).toHaveNoViolations()
    })
})
