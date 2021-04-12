/* Copyright Contributors to the Open Cluster Management project */

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

const INITIAL_POLL_INTERVAL = 30
const REFRESH_INTERVALS = [1, 30, 60, 5 * 60, 30 * 60, 0]
const REFRESH_INTERVAL_COOKIE = 'acm-page-refresh-interval'

export const AutoRefreshSelect = () => (
    <AcmPageCard>
        <AcmAutoRefreshSelect
            refetch={() => {
                console.log('AcmAutoRefreshSelect refetch. (This log is from storybook)') // eslint-disable-line no-console
                return null
            }}
            refreshIntervals={REFRESH_INTERVALS}
            refreshIntervalCookie={REFRESH_INTERVAL_COOKIE}
            initPollInterval={INITIAL_POLL_INTERVAL}
        />
    </AcmPageCard>
)
AutoRefreshSelect.args = {}
