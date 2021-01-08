import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'
import { AcmAutoRefreshSelect, getPollInterval } from './AcmAutoRefreshSelect'

describe('AcmAutoRefreshSelect ', () => {
    const OVERVIEW_REFRESH_INTERVAL_COOKIE = 'acm-overview-interval-refresh-cookie'
    const pollInterval = getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE)

    const RefreshSelect = () => {
        return (
            <AcmAutoRefreshSelect
                refetch={() => console.log('Refetch')}
                pollInterval={pollInterval}
                refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE}
            />
        )
    }

    test('validates RefreshSelect component renders with default selection', () => {
        const { getByText } = render(<RefreshSelect />)
        expect(getByText('Refresh every 30s')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<RefreshSelect />)
        expect(await axe(container)).toHaveNoViolations
    })
    // test('validates dropdown selection', () => {
    //     const {}
    // })
})
