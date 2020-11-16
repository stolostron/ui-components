import { render } from '@testing-library/react'
import React from 'react'
import { TableLoading } from './AcmTableLoading.stories'

describe('AcmTableLoading', () => {
    test('renders', () => {
        const { container } = render(<TableLoading />)
        expect(container.querySelector('table')).toBeInTheDocument()
    })
})
