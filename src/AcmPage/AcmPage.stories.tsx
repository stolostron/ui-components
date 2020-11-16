import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'
import { AcmButton } from '../AcmButton/AcmButton'

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
    return (
        <MemoryRouter>
            <AcmPage>
                <AcmPageHeader
                    title={args.title}
                    breadcrumb={breadcrumb}
                    actions={<AcmButton>Create resource</AcmButton>}
                />
                <AcmPageCard>Page with card</AcmPageCard>
            </AcmPage>
        </MemoryRouter>
    )
}
Page.args = { title: 'Page Header Title', breadcrumb: ['Breadcrumb 1', 'Breadcrumb 2', 'Breadcrumb 3'] }
