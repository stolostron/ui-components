import '@patternfly/react-core/dist/styles/base.css'
import React, { useState } from 'react'
import { AcmForm } from './AcmForm'
import { LoadingPage } from './LoadingPage'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'

export default {
    title: 'LoadingPage',
    component: LoadingPage,
}

export const TextInput = () => {
    const [value, setValue] = useState<string>()

    return (
        <AcmPage>
            <AcmPageHeader title="LoadingPage"></AcmPageHeader>
            <LoadingPage />
        </AcmPage>
    )
}
