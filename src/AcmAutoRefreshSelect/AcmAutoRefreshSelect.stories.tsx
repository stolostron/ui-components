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

const REFRESH_VALUES = [1, 30, 60, 5 * 60, 30 * 60, 0]
export const AutoRefreshSelect = () => (
    <AcmPageCard>
        <AcmAutoRefreshSelect
            refetch={() => {
                console.log('AcmAutoRefreshSelect refetch. (This log is from storybook)') // eslint-disable-line no-console
                return null
            }}
            refreshIntervals={REFRESH_VALUES}
        />
    </AcmPageCard>
)
AutoRefreshSelect.args = {}
