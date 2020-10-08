import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLoadingPage } from './AcmLoadingPage'
import { AcmPage, AcmPageHeader } from '../AcmPage/AcmPage'

export default {
    title: 'LoadingPage',
    component: AcmLoadingPage,
}

export const LoadingPage = () => {
    return (
        <AcmPage>
            <AcmPageHeader title="LoadingPage"></AcmPageHeader>
            <AcmLoadingPage />
        </AcmPage>
    )
}
