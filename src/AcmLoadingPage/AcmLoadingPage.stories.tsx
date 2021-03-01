/* Copyright Contributors to the Open Cluster Management project */

import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLoadingPage } from './AcmLoadingPage'

export default {
    title: 'LoadingPage',
    component: AcmLoadingPage,
    argTypes: {
        title: { type: 'string' },
        message: { type: 'string' },
    },
}

export const LoadingPage = (args) => <AcmLoadingPage {...args} />

LoadingPage.args = {}
