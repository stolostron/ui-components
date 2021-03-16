/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { MemoryRouter } from 'react-router'
import { AcmHeader, AcmRoute } from './AcmHeader'

export default {
    title: 'Header',
    component: AcmHeader,
}

export const Header = () => {
    return (
        <MemoryRouter>
            <AcmHeader route={AcmRoute.Welcome}>
                <div>test content</div>
            </AcmHeader>
        </MemoryRouter>
    )
}
