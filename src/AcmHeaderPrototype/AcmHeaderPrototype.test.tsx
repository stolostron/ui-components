import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmHeaderPrototype } from './AcmHeaderPrototype'
import userEvent from '@testing-library/user-event'

describe('AcmHeaderPrototype', () => {
    test('renders', async () => {
        const { container, getByRole, getByText } = render(
            <AcmHeaderPrototype href="/" target="_self">
                <div>test</div>
            </AcmHeaderPrototype>
        )
        expect(await axe(container)).toHaveNoViolations()
        userEvent.click(getByRole('button'))
        expect(getByText('test')).toBeInTheDocument()
    })
})
