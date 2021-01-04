import { render } from '@testing-library/react'
import { configureAxe } from 'jest-axe'
import React from 'react'
import { AcmInlineStatus, StatusType } from './AcmInlineStatus'
const axe = configureAxe({
    rules: {
        'aria-progressbar-name': { enabled: false },
    },
})

describe('AcmInlineStatus', () => {
    Object.values(StatusType).forEach((type) => {
        test('renders', () => {
            const { container } = render(<AcmInlineStatus type={type} status="foobar" />)
            expect(container.querySelector(`.inline-status-${type}`)).toBeInTheDocument()
        })
        test(`has zero accessibility defects - (${type})`, async () => {
            const { container } = render(<AcmInlineStatus type={type} status="foobar" />)
            expect(await axe(container)).toHaveNoViolations()
        })
    })
})
