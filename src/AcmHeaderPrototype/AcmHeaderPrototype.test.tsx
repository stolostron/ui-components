/* istanbul ignore file */
import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmHeaderPrototype } from './AcmHeaderPrototype'

describe('AcmHeaderPrototype', () => {
    test('renders', async () => {
        const { container } = render(
            <AcmHeaderPrototype href="https://patternfly.org" target="_blank">
                <div>test</div>
            </AcmHeaderPrototype>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
