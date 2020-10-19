import React from 'react'
import { render } from '@testing-library/react'
import { AcmLoadingPage } from './AcmLoadingPage'

describe('AcmLoadingPage', () => {
    test('renders', () => {
        const { getByText } = render(<AcmLoadingPage />)
        expect(getByText('Loading')).toBeInTheDocument()
        expect(getByText('Loading')).toBeInstanceOf(HTMLHeadingElement)
    })
})
