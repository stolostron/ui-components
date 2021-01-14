import React from 'react'
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { AcmAutoRefreshSelect } from './AcmAutoRefreshSelect'
import { act } from 'react-dom/test-utils'

describe('AcmAutoRefreshSelect ', () => {
    const refetch = jest.fn()

    beforeEach(() => {
        refetch.mockReset()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<AcmAutoRefreshSelect refetch={refetch} pollInterval={30000} />)
        expect(await axe(container)).toHaveNoViolations
    })
    test('renders', async () => {
        const { getByTestId, container } = render(<AcmAutoRefreshSelect refetch={refetch} pollInterval={30000} />)
        expect(getByTestId('refresh-dropdown')).toBeInTheDocument()
        expect(await axe(container)).toHaveNoViolations()
        userEvent.click(getByTestId('refresh-toggle'))
        await waitFor(() => expect(getByTestId('refresh-30s')).toBeInTheDocument())
        userEvent.click(getByTestId('refresh-30s'))
        expect(refetch).toHaveBeenCalled()
        expect(await axe(container)).toHaveNoViolations()
        userEvent.hover(getByTestId('refresh-dropdown'))
    })

    test('should use default poll interval when localStorage is empty', async () => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
            writable: true,
        })

        render(<AcmAutoRefreshSelect refetch={refetch} />)

        expect(window.localStorage.getItem).toHaveBeenCalledTimes(1)
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(2)
        expect(window.localStorage.setItem).toHaveBeenCalledWith('acm-overview-interval-refresh-cookie', '60000')
    })

    test('should use poll interrval from localStorage', async () => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => '60000'),
                setItem: jest.fn(),
            },
        })

        render(<AcmAutoRefreshSelect refetch={refetch} />)

        expect(window.localStorage.getItem).toReturnWith('60000')
        expect(screen.getByText('Refresh every 1m')).toBeInTheDocument()
    })

    test('refetch is called at the expected interval of 1 second', async () => {
        render(<AcmAutoRefreshSelect refetch={refetch} refreshIntervals={[1, 30, 60]} pollInterval={1000} />)

        expect(refetch).toHaveBeenCalledTimes(1)
        expect(screen.getByText('Refresh every 1s')).toBeInTheDocument()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        expect(refetch).toHaveBeenCalledTimes(2)
    })

    test('refetch is not fired when the browser is hidden', async () => {
        const refetchFn = jest.fn()
        let hidden = false

        Object.defineProperty(document, 'hidden', {
            get: () => hidden,
        })
        Object.defineProperty(document, 'addEventListener', {
            value: (eventName: string, eventCallback: () => void) => {
                if (eventName == 'visibilitychange') {
                    act(() => {
                        setTimeout(() => {
                            hidden = true
                            eventCallback()
                        }, 10)
                    })
                }
            },
        })

        await act(async () => {
            render(<AcmAutoRefreshSelect refetch={refetch} refreshIntervals={[1, 30, 60]} pollInterval={100} />)
            await new Promise((resolve) => setTimeout(resolve, 200))
        })
        expect(refetchFn).toHaveBeenCalledTimes(0)
    })

    test('refresh button fires refetch', () => {
        const { getByTestId } = render(<AcmAutoRefreshSelect refetch={refetch} pollInterval={30000} />)
        const refreshIcon = getByTestId('refresh-icon')
        expect(refreshIcon).toBeInTheDocument()
        userEvent.click(refreshIcon)
        expect(refetch).toHaveBeenCalled()
        fireEvent.keyPress(refreshIcon, { key: 'Enter', code: 13, charCode: 13 })
        expect(refetch).toHaveBeenCalled()
    })
})
