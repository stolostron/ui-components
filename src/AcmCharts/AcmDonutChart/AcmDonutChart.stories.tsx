import React from 'react'
import { AcmDonutChart } from './AcmDonutChart'
import { AcmChartGroup } from '../AcmChartGroup'

export default {
    title: 'Charts',
    component: AcmDonutChart,
}

export const DonutChart = () => {
    const complianceData = [
        { key: 'Compliant', value: 1, isPrimary: true },
        { key: 'Non-compliant', value: 1, isDanger: true },
    ]
    const podData = [
        { key: 'Running', value: 90, isPrimary: true },
        { key: 'Pending', value: 8 },
        { key: 'Failed', value: 2, isDanger: true },
    ]
    const clusterData = [
        { key: 'Ready', value: 2, isPrimary: true },
        { key: 'Offline', value: 0, isDanger: true },
    ]
    return (
        <AcmChartGroup>
            <AcmDonutChart
                title="Cluster compliance"
                description="Overview of policy compliance status"
                data={complianceData}
            />
            <AcmDonutChart title="Pods" description="Overview of pod count and status" data={podData} />
            <AcmDonutChart title="Cluster status" description="Overview of cluster status" data={clusterData} />
        </AcmChartGroup>
    )
}
