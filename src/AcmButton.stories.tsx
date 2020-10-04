import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { AcmButton } from './AcmButton'
import { Meta } from '@storybook/react'
import { AcmPage, AcmPageCard, AcmPageHeader } from './AcmPage'

const meta: Meta = {
    title: 'AcmButton',
    component: AcmButton,
}
export default meta

export const SimpleButton = () => (
    <AcmPage>
        <AcmPageHeader title="AcmButton"></AcmPageHeader>
        <AcmPageCard>
            <AcmButton>Button</AcmButton>
        </AcmPageCard>
    </AcmPage>
)
