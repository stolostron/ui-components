import React from 'react'
import { render } from '@testing-library/react'
import { AcmLoadingPage } from './AcmLoadingPage'
import { axe } from 'jest-axe'

describe('AcmLoadingPage', () => {
    test('renders', () => {
        const { getByText } = render(<AcmLoadingPage />)
        expect(getByText('Loading')).toBeInTheDocument()
        expect(getByText('Loading')).toBeInstanceOf(HTMLHeadingElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmLoadingPage />)
        expect(await axe(container)).toHaveNoViolations()
    })
})
