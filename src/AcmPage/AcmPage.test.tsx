import React from 'react'
import { render } from '@testing-library/react'
import { AcmPage, AcmPageHeader, AcmPageCard } from './AcmPage'

describe('AcmPage', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPage>ACM page</AcmPage>)
        expect(getByText('ACM page')).toBeInTheDocument()
        expect(getByText('ACM page')).toBeInstanceOf(HTMLElement)
    })
})

describe('AcmPageHeader', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPageHeader title="ACM header" />)
        expect(getByText('ACM header')).toBeInTheDocument()
        expect(getByText('ACM header')).toBeInstanceOf(HTMLHeadingElement)
    })
})

describe('AcmPageCard', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPageCard>ACM card</AcmPageCard>)
        expect(getByText('ACM card')).toBeInTheDocument()
        expect(getByText('ACM card')).toBeInstanceOf(HTMLDivElement)
    })
})
