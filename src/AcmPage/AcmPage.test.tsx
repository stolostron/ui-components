import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmPage, AcmPageHeader, AcmPageCard, AcmBreadcrumb } from './AcmPage'

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

describe('AcmBreadcrumb', () => {
    test('renders', () => {
        const { getByText, container } = render(
            <AcmBreadcrumb
                breadcrumbs={[
                    { text: 'First', to: '/first' },
                    { text: 'Second', to: '/second' },
                ]}
            />
        )
        expect(getByText('First')).toBeInTheDocument()
        expect(getByText('First')).toBeInstanceOf(HTMLAnchorElement)
        expect(container.querySelector('[aria-current="page"]')).toContainHTML('Second') // verify last crumb is disabled
    })
    test('renders null when no breadcrumbs are provided', () => {
        const { container } = render(<AcmBreadcrumb breadcrumbs={[]} />)
        expect(container).toMatchInlineSnapshot('<div />')
    })
    test('should not disable a single breadcrumb', () => {
        const { getByText } = render(<AcmBreadcrumb breadcrumbs={[{ text: 'First', to: '/first' }]} />)
        expect(getByText('First')).not.toHaveAttribute('aria-current')
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(
            <AcmBreadcrumb
                breadcrumbs={[
                    { text: 'First', to: '/foo' },
                    { text: 'Second', to: '/foo' },
                ]}
            />
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
