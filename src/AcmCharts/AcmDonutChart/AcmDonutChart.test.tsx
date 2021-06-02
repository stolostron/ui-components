/* Copyright Contributors to the Open Cluster Management project */

import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AcmDonutChart } from './AcmDonutChart'

const complianceData = [
    { key: 'Compliant', value: 1, isPrimary: true, link: '/linkToCompiantResources' },
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
        const { getByRole, getByTestId } = render(
            <AcmDonutChart
                title="Cluster compliance"
                description="Overview of policy compliance status"
                data={complianceData}
            />
        )
        expect(getByTestId('cluster-compliance-chart')).toBeInTheDocument()
        expect(getByRole('link')).toBeInTheDocument()
    })

    test('renders skeleton', () => {
        const { queryByText } = render(
            <AcmDonutChart loading={true} title="Cluster compliance" description="Policy compliance" data={[]} />
        )
        expect(queryByText('Cluster compliance')).toBeInTheDocument()
    })

    test('renders with zero values state', () => {
        const { queryByRole, getByText } = render(
            <AcmDonutChart title="Some title" description="Some description" data={zeroData} />
        )
        expect(getByText('0%')).toBeInTheDocument()
        expect(getByText('0 Key1')).toBeInTheDocument()
        expect(getByText('0 Key2')).toBeInTheDocument()
        expect(queryByRole('link')).toBeNull() // zeroData doesn't declare links.
    })

    test('has zero accessibility defects', async () => {
        const { container } = render(
            <AcmDonutChart title="Pods" description="Overview of pod count and status" data={podData} />
        )
        expect(await axe(container)).toHaveNoViolations()
    })

    test('alternate donut title text', async () => {
        const { queryByText } = render(
            <AcmDonutChart
                title="Pods"
                description="Overview of pod count and status"
                data={podData}
                donutLabel={{
                    title: '100',
                    subTitle: 'total pods',
                }}
            />
        )
        expect(queryByText('total pods')).toBeInTheDocument()
    })
})
