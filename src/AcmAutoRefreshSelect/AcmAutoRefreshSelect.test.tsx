import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmAutoRefreshSelect, getPollInterval } from './AcmAutoRefreshSelect'

describe('AcmAutoRefreshSelect ', () => {
    const refetch = jest.fn()
    const OVERVIEW_REFRESH_INTERVAL_COOKIE = 'acm-overview-interval-refresh-cookie'
    const pollInterval = getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE)

    const RefreshSelect = () => {
        return <AcmAutoRefreshSelect refetch={refetch} pollInterval={pollInterval} />
    }

    test('has zero accessibility defects', async () => {
        const { container } = render(<RefreshSelect />)
        expect(await axe(container)).toHaveNoViolations
    })
    test('renders', async () => {
        const { getByTestId, container } = render(<RefreshSelect />)
        expect(getByTestId('refresh-dropdown')).toBeInTheDocument()
        expect(await axe(container)).toHaveNoViolations()
        userEvent.click(getByTestId('refresh-toggle'))
        await waitFor(() => expect(getByTestId('refresh-30s')).toBeInTheDocument())
        userEvent.click(getByTestId('refresh-30s'))
        expect(refetch).toHaveBeenCalled()
        expect(await axe(container)).toHaveNoViolations()
        userEvent.hover(getByTestId('refresh-dropdown'))
    })

    test('saves to localStorage', () => {})
})
