import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLabels } from './AcmLabels'
import { AcmPageCard } from '../AcmPage/AcmPage'

export default {
    title: 'Labels',
    component: AcmLabels,
}

export const Labels = () => (
    <AcmPageCard>
        <AcmLabels
            labels={{
                abc: '123',
                empty: '',
                test: 'this is a test of a really long label. it is really long. abcdefghijklmnopqrstuvwxyz',
            }}
        />
    </AcmPageCard>
)
