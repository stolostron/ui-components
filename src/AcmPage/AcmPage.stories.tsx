import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmSecondaryNav, AcmSecondaryNavItem } from '../AcmSecondaryNav/AcmSecondaryNav'
import { AcmDropdown } from '../AcmDropdown/AcmDropdown'

export default {
    title: 'Page',
    component: AcmPage,
    argTypes: {
        title: { type: 'string' },
        breadcrumb: { type: 'array' },
    },
}

export const Page = (args) => {
    const breadcrumb = args.breadcrumb.map((crumb) => ({ text: crumb, to: '/foobar' }))
    const dropdownItems = [
        { id: '5s', text: 'Refresh every 5s' },
        { id: '10s', text: 'Refresh every 10s' },
        { id: '20s', text: 'Refresh every 20s' },
        { id: '30s', text: 'Refresh every 30s' },
    ]
    return (
        <MemoryRouter>
            <AcmPage>
                <AcmPageHeader
                    breadcrumb={breadcrumb}
                    title={args.title}
                    navigation={
                        <AcmSecondaryNav>
                            <AcmSecondaryNavItem isActive={true}>Page 1</AcmSecondaryNavItem>
                            <AcmSecondaryNavItem isActive={false}>Page 2</AcmSecondaryNavItem>
                        </AcmSecondaryNav>
                    }
                    controls={
                        <AcmDropdown
                            id="dropdown"
                            isDisabled={false}
                            tooltip="Default tooltip"
                            text="Refresh every 5s"
                            isKebab={false}
                            onSelect={() => undefined}
                            dropdownItems={dropdownItems}
                            value={'5s'}
                        />
                    }
                    actions={<AcmButton>Create resource</AcmButton>}
                />
                <AcmPageCard>Page with card</AcmPageCard>
            </AcmPage>
        </MemoryRouter>
    )
}
Page.args = { title: 'Page Header Title', breadcrumb: ['Breadcrumb 1', 'Breadcrumb 2', 'Breadcrumb 3'] }
