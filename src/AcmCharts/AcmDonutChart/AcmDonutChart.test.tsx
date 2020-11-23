import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmDonutChart } from './AcmDonutChart'

describe('AcmDonutChart', () => {
    const complianceData = [
        { key: 'Compliant', value: 1, isPrimary: true },
        { key: 'Non-compliant', value: 1, isDanger: true },
    ]
    const podData = [
        { key: 'Running', value: 90, isPrimary: true },
        { key: 'Pending', value: 8 },
        { key: 'Failed', value: 2, isDanger: true },
    ]
    // const clusterData = [
    //     { key: 'Ready', value: 2, isPrimary: true },
    //     { key: 'Offline', value: 0, isDanger: true },
    // ]
    test('renders', () => {
        const { getByTestId } = render(
            <AcmDonutChart
                title="Cluster compliance"
                description="Overview of policy compliance status"
                data={complianceData}
            />
        )
        expect(getByTestId('cluster-compliance-chart')).toBeInTheDocument()
    })
    test('has zero accessibility defects', async () => {
        const { container } = render(
            <AcmDonutChart title="Pods" description="Overview of pod count and status" data={podData} />
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
