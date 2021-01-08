import '@patternfly/react-core/dist/styles/base.css'
import React from 'react'
import { Meta } from '@storybook/react'
import { AcmAutoRefreshSelect, getPollInterval } from './AcmAutoRefreshSelect'
import { AcmPageCard } from '../AcmPage/AcmPage'

const meta: Meta = {
    title: 'AutoRefreshSelect',
    component: AcmAutoRefreshSelect,
    argTypes: {},
}
export default meta

const OVERVIEW_REFRESH_INTERVAL_COOKIE = 'acm-overview-interval-refresh-cookie'
const pollInterval = getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE)

export const AutoRefreshSelect = () => (
    <AcmPageCard>
        <AcmAutoRefreshSelect
            refetch={() => console.log('Refetch')}
            pollInterval={pollInterval}
            refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE}
        ></AcmAutoRefreshSelect>
    </AcmPageCard>
)
AutoRefreshSelect.args = {}
