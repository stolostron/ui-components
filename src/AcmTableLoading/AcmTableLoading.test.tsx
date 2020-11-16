import { render } from '@testing-library/react'
import React from 'react'
import { AcmTableLoading } from './AcmTableLoading'

describe('AcmTableLoading', () => {
    test('renders', () => {
        const { container } = render(<AcmTableLoading />)
        expect(container.querySelector('table')).toBeInTheDocument()
    })
})
