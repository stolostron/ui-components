import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { AcmLabelsInput } from './AcmLabelsInput'

describe('AcmLabelsInput', () => {
    test('renders', async () => {
        const { getByText, getByTestId } = render(
            <AcmLabelsInput id="label-input" label="Label input" onChange={() => null} value={['foo=bar']} />
        )

        fireEvent.click(getByTestId('label-input-button'))
        expect(getByText('Label input')).toBeInTheDocument()
        expect(getByTestId('label-input')).toBeInstanceOf(HTMLInputElement)
    })
})
