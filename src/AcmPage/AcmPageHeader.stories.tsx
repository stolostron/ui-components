import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmPage, AcmPageHeader } from './AcmPage'
import { MemoryRouter } from 'react-router-dom'
import { AcmButton } from '../AcmButton/AcmButton'
import { AcmSecondaryNav, AcmSecondaryNavItem } from '../AcmSecondaryNav/AcmSecondaryNav'

const meta: Meta = {
    title: 'PageHeader',
    component: AcmPageHeader,
    argTypes: {
        title: { type: 'string' },
        navigation: { type: 'string' },
        controls: { type: 'string' },
        actions: { type: 'string' },
    },
}
export default meta

export const PageHeader = (args) => {
    return (
        <MemoryRouter>
            <AcmPage>
                <AcmPageHeader {...args} />
            </AcmPage>
        </MemoryRouter>
    )
}
PageHeader.args = {
    breadcrumb: [{ text: 'Page 1' }, { text: 'Page 2' }, { text: 'Page 3' }],
    title: 'Page title',
    titleTooltip: 'Doc link',
    navigation: (
        <AcmSecondaryNav>
            <AcmSecondaryNavItem isActive={true}>Clusters</AcmSecondaryNavItem>
            <AcmSecondaryNavItem isActive={false}>Discovered clusters</AcmSecondaryNavItem>
        </AcmSecondaryNav>
    ),
    controls: 'Refresh every 5s',
    actions: <AcmButton>Create</AcmButton>,
}
