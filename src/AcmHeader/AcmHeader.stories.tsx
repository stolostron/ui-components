/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { MemoryRouter } from 'react-router'
import { AcmHeader } from './AcmHeader'

export default {
    title: 'Header',
    component: AcmHeader,
}

export const Header = () => {
    return (
        <MemoryRouter>
            <AcmHeader>
                <div>test content</div>
            </AcmHeader>
        </MemoryRouter>
    )
}
