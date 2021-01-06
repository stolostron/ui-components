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

const REFRESH_TIMES = [5, 10, 30, 60, 5 * 60, 30 * 60, 0]
const OVERVIEW_REFRESH_INTERVAL_COOKIE = 'acm-overview-interval-refresh-cookie'
const pollInterval = getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE)

export const AutoRefreshSelect = () => (
    <AcmPageCard>
        <AcmAutoRefreshSelect
            refetch={() => console.log('Refetch')}
            startPolling={(pi) => console.log('startPolling', pi)}
            stopPolling={() => console.log('stopPolling')}
            pollInterval={pollInterval}
            refreshValues={REFRESH_TIMES}
            refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE}
        ></AcmAutoRefreshSelect>
    </AcmPageCard>
)
AutoRefreshSelect.args = {}
