import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmSummaryList } from './AcmSummaryList'
import { Menu } from './AcmSummaryList.stories'

describe('AcmSummaryList', () => {
    const list = [
        { isPrimary: true, description: 'Applications', count: 3, href: '/search?query=apps' },
        { description: 'Clusters', count: 2, href: '/search?query=clusters' },
        { description: 'Kubernetes type', count: 1 },
        { description: 'Region', count: 1 },
        { description: 'Nodes', count: 3, href: '/search?query=nodes' },
        { description: 'Pods', count: 3, href: '/search?query=pods' },
    ]
    test('renders', () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <AcmSummaryList title="Summary" list={list} />
            </MemoryRouter>
        )
        expect(getByTestId('applications-summary')).toBeInTheDocument()
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(
            <MemoryRouter>
                <AcmSummaryList
                    title="Summary"
                    list={list}
                    actions={[<Menu key="menu" />]}
                    rightAction={<button>Expand details</button>}
                />
            </MemoryRouter>
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
