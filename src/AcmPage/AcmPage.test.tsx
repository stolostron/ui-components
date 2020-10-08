import React from 'react'
import { render } from '@testing-library/react'
import { AcmPage } from './AcmPage'

describe('AcmPage', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPage>ACM page</AcmPage>)
        expect(getByText('ACM page')).toBeInTheDocument()
        expect(getByText('ACM page')).toBeInstanceOf(HTMLElement)
    })
})
