import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmAutoRefreshSelect, getPollInterval } from './AcmAutoRefreshSelect'
import { act } from 'react-dom/test-utils'

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

    test('should call getPollInterval and savePollInterval on component load', async () => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            },
            writable: true,
        })
        act(() => {
            render(<RefreshSelect />)
        })
        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1)
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1)
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'acm-overview-interval-refresh-cookie',
            '{"pollInterval":30000}'
        )
        // await waitFor(() => expect(getByTestId('test')).toBeInTheDocument())
    })

    test('checks for savedInterval in getPollInterval', async () => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            },
            writable: true,
        })
        act(() => {
            render(<RefreshSelect />)
        })
    })
})
