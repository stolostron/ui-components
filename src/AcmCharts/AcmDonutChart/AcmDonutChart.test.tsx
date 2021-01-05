import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmDonutChart } from './AcmDonutChart'

const complianceData = [
    { key: 'Compliant', value: 1, isPrimary: true },
    { key: 'Non-compliant', value: 1, isDanger: true },
]
const zeroData = [
    { key: 'Key1', value: 0, isPrimary: true },
    { key: 'Key2', value: 0, isDanger: true },
]
const podData = [
    { key: 'Running', value: 90, isPrimary: true },
    { key: 'Pending', value: 8 },
    { key: 'Failed', value: 2, isDanger: true },
]

describe('AcmDonutChart', () => {
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

    test('renders skeleton', () => {
        const { queryByText } = render(
            <AcmDonutChart loading={true} title="Cluster compliance" description="Policy compliance" data={[]} />
        )
        expect(queryByText('Cluster compliance')).toBeInTheDocument()
    })

    test('renders with zero values state', () => {
        const { getByText } = render(
            <AcmDonutChart title="Some title" description="Some description" data={zeroData} />
        )
        expect(getByText('0%')).toBeInTheDocument()
        expect(getByText('0 Key1')).toBeInTheDocument()
        expect(getByText('0 Key2')).toBeInTheDocument()
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(
            <AcmDonutChart title="Pods" description="Overview of pod count and status" data={podData} />
        )
        expect(await axe(container)).toHaveNoViolations()
    })
})
