/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { AcmHeader } from './AcmHeader'

export default {
    title: 'Header',
    component: AcmHeader,
}

export const Header = () => {
    return (
        <AcmHeader urlpath="/multicloud/policies/all" href="https://patternfly.org" target="_blank">
            <div>test content</div>
        </AcmHeader>
    )
}
