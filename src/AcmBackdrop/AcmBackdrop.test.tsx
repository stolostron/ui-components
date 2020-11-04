import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmSpinnerBackdrop } from './AcmBackdrop'

describe('AcmSpinnerBackdrop', () => {
    test('renders', () => {
        const { getByRole } = render(<AcmSpinnerBackdrop />)
        expect(getByRole('progressbar')).toBeInTheDocument()
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmSpinnerBackdrop />)
        expect(await axe(container)).toHaveNoViolations()
    })
})
