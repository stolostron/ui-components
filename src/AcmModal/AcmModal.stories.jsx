import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmModal } from './AcmModal'
import { AcmPage, AcmPageCard, AcmPageHeader } from '../AcmPage/AcmPage'

const meta: Meta = {
    title: 'Modal',
    component: AcmModal,
}
export default meta

export const Modal = () => (
    <AcmPage>
        <AcmPageHeader title="AcmButton"></AcmPageHeader>
        <AcmPageCard>
            <AcmModal>Button</AcmModal>
        </AcmPageCard>
    </AcmPage>
)
