import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmLabels } from './AcmLabels'

export default {
    title: 'Labels',
    component: AcmLabels,
}

export const Labels = () => <AcmLabels labels={['abc=123', 'test']} />
