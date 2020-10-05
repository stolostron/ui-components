import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'AcmPage',
    component: AcmPage,
}

export const Page = () => {
    return (
        <AcmPage>
            <AcmPageHeader title="Page Header Title"></AcmPageHeader>
            <AcmPageCard>Page with card</AcmPageCard>
        </AcmPage>
    )
}
