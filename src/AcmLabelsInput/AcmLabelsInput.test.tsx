import React, { useState } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmLabelsInput } from './AcmLabelsInput'

describe('AcmLabelsInput', () => {
    const LabelsInput = () => {
        const [value, setValue] = useState<string[] | undefined>()
        return (
            <AcmLabelsInput
                label="Label input"
                id="label-input"
                value={value}
                onChange={setValue}
                buttonLabel="Add label"
            />
        )
    }
    test('renders', async () => {
        const { getByText, getByTestId } = render(<LabelsInput />)
        expect(getByTestId('label-input-button')).toBeVisible()

        userEvent.click(getByTestId('label-input-button'))
        expect(getByText('Label input')).toBeInTheDocument()
        expect(getByTestId('label-input')).toBeInstanceOf(HTMLInputElement)
    })
    test('can add and remove labels', async () => {
        const { queryByText, getByTestId } = render(<LabelsInput />)
        const labels = ['foo=bar', 'coffee=bean']

        // add labels
        labels.forEach((label) => {
            userEvent.click(getByTestId('label-input-button'))
            userEvent.type(getByTestId('label-input'), `${label}{enter}`)
            expect(queryByText(label)).toBeVisible()
            expect(queryByText(label)).toBeInstanceOf(HTMLSpanElement)
        })
        // delete labels
        labels.forEach((label) => {
            userEvent.click(getByTestId(`remove-${label}`))
            expect(queryByText(label)).toBeNull()
        })
    })
    test('does not allow duplicate labels', async () => {
        const { queryByText, queryAllByText, getByTestId } = render(<LabelsInput />)
        const labels = ['foo=bar', 'foo=bar']

        labels.forEach((label) => {
            userEvent.click(getByTestId('label-input-button'))
            userEvent.type(getByTestId('label-input'), `${label}{enter}`)
            expect(queryByText(label)).toBeVisible()
            expect(queryByText(label)).toBeInstanceOf(HTMLSpanElement)
        })
        expect(queryAllByText('foo=bar')).toHaveLength(1)
    })
    test('input can be exited by escape and enter', async () => {
        const { queryByText, getByTestId } = render(<LabelsInput />)
        const commands = ['{esc}', '{enter}']
        // verify escape and enter exit input behavior
        commands.forEach((cmd) => {
            userEvent.click(getByTestId('label-input-button'))
            userEvent.type(getByTestId('label-input'), cmd)
            expect(queryByText('label=null')).toBeNull()
        })
    })
    test('has zero accessibility defects', async () => {
        const { getByTestId, container } = render(<LabelsInput />)
        expect(await axe(container)).toHaveNoViolations()

        userEvent.click(getByTestId('label-input-button'))
        expect(await axe(container)).toHaveNoViolations()

        userEvent.type(getByTestId('label-input'), 'foo=bar{enter}')
        expect(await axe(container)).toHaveNoViolations()
    })

    test('allows an undefined value to be set', async () => {
        const UndefinedLabelsInput = () => {
            const [value, setValue] = useState<string[] | undefined>(undefined)
            return (
                <AcmLabelsInput
                    label="Label input"
                    id="label-input"
                    value={value}
                    onChange={setValue}
                    buttonLabel="Add label"
                />
            )
        }
        const { getByTestId } = render(<UndefinedLabelsInput />)
        expect(getByTestId('label-input-button')).toBeVisible()
    })
})
