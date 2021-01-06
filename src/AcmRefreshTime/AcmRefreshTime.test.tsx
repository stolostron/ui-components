import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmRefreshTime } from './AcmRefreshTime'

// Reloading Timestamp tests

describe('AcmRefreshTimeReloading', () => {
    const timestamp = 'Wed Jan 06 2021 00:00:00 GMT+0000 (Coordinated Universal Time)'

    const ReloadingRefreshTime = () => {
        return <AcmRefreshTime timestamp={timestamp} reloading={true} />
    }
    test('validates reloading spinner is present', () => {
        const { getByRole } = render(<ReloadingRefreshTime />)
        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(<ReloadingRefreshTime />)
        expect(await axe(container)).toHaveNoViolations
    })
})

// Timestamp tests

describe('AcmRefreshTime', () => {
    const timestamp = 'Wed Jan 06 2021 00:00:00 GMT+0000 (Coordinated Universal Time)'

    const RefreshTime = () => {
        return <AcmRefreshTime timestamp={timestamp} />
    }

    test('has zero accessibility defects', async () => {
        const { container } = render(<RefreshTime />)
        expect(await axe(container)).toHaveNoViolations
    })

    test('validates RefreshTime component renders', () => {
        const { getByText } = render(<RefreshTime />)
        expect(getByText('Last update: 7:00:00 PM')).toBeInTheDocument()
    })
})
