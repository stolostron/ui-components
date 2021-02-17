import React from 'react'
import { AcmHeaderPrototype } from './AcmHeaderPrototype'

export default {
    title: 'HeaderPrototype',
    component: AcmHeaderPrototype,
}

export const HeaderPrototype = () => {
    return (
        <AcmHeaderPrototype urlpath="/multicloud/policies/all" href="https://patternfly.org" target="_blank">
            <div>test content</div>
        </AcmHeaderPrototype>
    )
}
