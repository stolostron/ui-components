import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmPage, AcmPageHeader, AcmPageCard } from '../src'

export const parameters = {
    layout: 'fullscreen'
}

export const decorators = [(Story) => <AcmPage><AcmPageCard><Story /></AcmPageCard></AcmPage>]
