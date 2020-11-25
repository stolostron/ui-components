import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmInlineStatus, StatusType } from './AcmInlineStatus'

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
