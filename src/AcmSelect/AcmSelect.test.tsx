import React, { useState } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcmSelect, AcmSelectVariant } from './AcmSelect'
import { ClosedModalProps } from '../AcmModal/AcmModal'

describe('AcmSelect - single', () => {
    test('renders with options of type: string', () => {
        const { getByText } = render(
            <AcmSelect
                variant={AcmSelectVariant.single}
                id="acm-select"
                label="ACM select"
                onChange={() => null}
                options={['foo', 'bar']}
                value="foo"
            />
        )
        expect(getByText('ACM select')).toBeInTheDocument()
    })
    test('render with options of type: object', () => {
        const { getByText } = render(
            <AcmSelect
                variant={AcmSelectVariant.single}
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
})

describe('AcmSelect - Multiselect', () => {
    const MultiSelect = (props: { options: string[] | { title: string; value: string }[] }) => {
        const [value, setValue] = useState<string[]>([])
        const onSelect = (selection: string) => {
            value?.includes(selection)
                ? setValue(value?.filter((v) => v !== selection))
                : setValue([...value, selection])
        }
        return (
            <AcmSelect
                variant={AcmSelectVariant.checkbox}
                label="Color (lowercase)"
                id="select-color"
                options={props.options}
                value={value}
                onChange={onSelect}
                placeholder="Select your color"
                clear
            />
        )
    }
    test('renders with options of type: string', () => {
        const { getByTestId } = render(<MultiSelect options={['red', 'green', 'blue']} />)
        expect(getByTestId('select-color')).toBeInTheDocument()
    })
    test('renders with options of type: string', () => {
        const { getByTestId } = render(
            <MultiSelect
                options={[
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                ]}
            />
        )
        expect(getByTestId('select-color')).toBeInTheDocument()
    })
})
