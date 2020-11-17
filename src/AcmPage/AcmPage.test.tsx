import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmPage, AcmPageHeader, AcmPageCard, AcmBreadcrumb } from './AcmPage'
import { AcmButton } from '../AcmButton/AcmButton'

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
    test('can render page actions', () => {
        const { getByText } = render(
            <AcmPageHeader title="ACM header" actions={<AcmButton>Create resource</AcmButton>} />
        )
        expect(getByText('Create resource')).toBeInTheDocument()
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
            <MemoryRouter>
                <AcmBreadcrumb
                    breadcrumb={[
                        { text: 'First', to: '/first' },
                        { text: 'Second', to: '/second' },
                    ]}
                />
            </MemoryRouter>
        )
        expect(getByText('First')).toBeInTheDocument()
        expect(getByText('First')).toBeInstanceOf(HTMLAnchorElement)
        expect(container.querySelector('[aria-current="page"]')).toContainHTML('Second') // verify last crumb is disabled
    })
    test('renders null when no breadcrumbs are provided', () => {
        const { container } = render(
            <MemoryRouter>
                <AcmBreadcrumb breadcrumb={[]} />
            </MemoryRouter>
        )
        expect(container).toMatchInlineSnapshot('<div />')
    })
    test('should not disable a single breadcrumb', () => {
        const { getByText } = render(
            <MemoryRouter>
                <AcmBreadcrumb breadcrumb={[{ text: 'First', to: '/first' }]} />
            </MemoryRouter>
        )
        expect(getByText('First')).not.toHaveAttribute('aria-current')
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(
            <MemoryRouter>
                <AcmBreadcrumb
                    breadcrumb={[
                        { text: 'First', to: '/first' },
                        { text: 'Second', to: '/second' },
                    ]}
                />
            </MemoryRouter>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
