import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmButton } from './AcmButton'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

const meta: Meta = {
    title: 'Button',
    component: AcmButton,
}
export default meta

export const Button = () => (
    <AcmPage>
        <AcmPageHeader title="AcmButton"></AcmPageHeader>
        <AcmPageCard>
            <AcmButton>Button</AcmButton>
        </AcmPageCard>
    </AcmPage>
)
