import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmPage, AcmPageHeader, AcmPageCard } from './AcmPage'

describe('AcmPage', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPage>ACM page</AcmPage>)
        expect(getByText('ACM page')).toBeInTheDocument()
        expect(getByText('ACM page')).toBeInstanceOf(HTMLElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmPage>ACM page</AcmPage>)
        expect(await axe(container)).toHaveNoViolations()
    })
})

describe('AcmPageHeader', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPageHeader title="ACM header" />)
        expect(getByText('ACM header')).toBeInTheDocument()
        expect(getByText('ACM header')).toBeInstanceOf(HTMLHeadingElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmPageHeader title="ACM header" />)
        expect(await axe(container)).toHaveNoViolations()
    })
})

describe('AcmPageCard', () => {
    test('renders', () => {
        const { getByText } = render(<AcmPageCard>ACM card</AcmPageCard>)
        expect(getByText('ACM card')).toBeInTheDocument()
        expect(getByText('ACM card')).toBeInstanceOf(HTMLDivElement)
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmPageCard>ACM card</AcmPageCard>)
        expect(await axe(container)).toHaveNoViolations()
    })
})
