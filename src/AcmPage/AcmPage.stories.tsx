import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'Page',
    component: AcmPage,
    argTypes: {
        title: { type: 'string' },
        breadcrumbs: { type: 'array' },
    },
}

export const Page = (args) => {
    const breadcrumbs = args.breadcrumbs.map((crumb) => ({ text: crumb, to: '/foobar' }))
    return (
        <MemoryRouter>
            <AcmPage>
                <AcmPageHeader title={args.title} breadcrumbs={breadcrumbs}></AcmPageHeader>
                <AcmPageCard>Page with card</AcmPageCard>
            </AcmPage>
        </MemoryRouter>
    )
}
Page.args = { title: 'Page Header Title', breadcrumbs: ['Breadcrumb 1', 'Breadcrumb 2', 'Breadcrumb 3'] }
