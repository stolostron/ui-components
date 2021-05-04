/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { render } from '@testing-library/react'
import { configureAxe } from 'jest-axe'
import { AcmProgressTracker } from './AcmProgressTracker'
import { StatusType } from '../AcmInlineStatus/AcmInlineStatus'

const axe = configureAxe({
    rules: {
        'aria-progressbar-name': { enabled: false },
    },
})

describe('AcmProgressTracker', () => {
    const ProgressTracker = () => {
        const steps = [
            {
                active: false,
                statusType: StatusType.healthy,
                statusText: 'Pre-creation jobs',
            },
            {
                active: true,
                statusType: StatusType.progress,
                statusText: 'Cluster install',
            },
            {
                active: false,
                statusType: StatusType.empty,
                statusText: 'Klusterlet install',
            },
            {
                active: false,
                statusType: StatusType.empty,
                statusText: 'Post-creation jobs',
            },
        ]

        return <AcmProgressTracker steps={steps} isCentered={true} />
    }

    test('renders', async () => {
        const { getByText } = render(<ProgressTracker />)
        expect(getByText('Pre-creation jobs')).toBeInTheDocument()
        expect(getByText('Cluster install')).toBeInTheDocument()
        expect(getByText('Klusterlet install')).toBeInTheDocument()
        expect(getByText('Post-creation jobs')).toBeInTheDocument()
    })
    test('has zero accessibility defects', async () => {
        // don't test loading because it's covered in AcmLoadingPage
        const { container } = render(<ProgressTracker />)
        expect(await axe(container)).toHaveNoViolations()
    })
})
