import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmAutoRefreshSelect } from './AcmAutoRefreshSelect'
import { AcmPageCard } from '../AcmPage/AcmPage'

const meta: Meta = {
    title: 'AutoRefreshSelect',
    component: AcmAutoRefreshSelect,
    argTypes: {},
}
export default meta

export const AutoRefreshSelect = () => (
    <AcmPageCard>
        <AcmAutoRefreshSelect refetch={() => console.log('Refetch')}></AcmAutoRefreshSelect>
    </AcmPageCard>
)
AutoRefreshSelect.args = {}
