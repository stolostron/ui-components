import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmHeaderPrototype } from './AcmHeaderPrototype'
import userEvent from '@testing-library/user-event'

describe('AcmHeaderPrototype', () => {
    test('renders', async () => {
        const { container, getByRole } = render(
            <AcmHeaderPrototype href="https://patternfly.org" target="_blank"></AcmHeaderPrototype>
        )
        expect(await axe(container)).toHaveNoViolations()
        userEvent.click(getByRole('button'))
    })
})
