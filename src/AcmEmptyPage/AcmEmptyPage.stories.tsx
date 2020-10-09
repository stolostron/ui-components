import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmEmptyPage } from './AcmEmptyPage'

export default {
    title: 'EmptyPage',
    component: AcmEmptyPage,
}

export const EmptyPage = () => <AcmEmptyPage title="Title" message="Message" />
