/* eslint-disable react/display-name */
/* Copyright Contributors to the Open Cluster Management project */

import { Meta } from '@storybook/react'
import React from 'react'
import {
    Task,
    taskColumns,
    taskRiskFilter,
    tasksErrorAlertAction,
    tasksPrimaryAction,
    tasksSecondaryAction,
    taskStatusFilter,
    tasksWarningAlertAction,
    useMockTasks,
} from './mocks/mock-tasks'
import { TablePage } from './TablePage'
import { useFilter } from './useFilter'

const meta: Meta = {
    title: 'TableToolbar',
}
export default meta

export function TableToolbar() {
    const tasks = useMockTasks(100000, 200)
    const statusFilter = useFilter<Task>(taskStatusFilter, tasks)
    const riskFilter = useFilter<Task>(taskRiskFilter, statusFilter.collection)
    const actions = [tasksPrimaryAction, tasksSecondaryAction, tasksErrorAlertAction, tasksWarningAlertAction]
    return (
        <TablePage<Task>
            title="Tasks"
            collection={riskFilter.collection}
            columns={taskColumns}
            tableActions={actions}
            searchKeys={[
                { name: 'name', weight: 1 },
                { name: 'labels', weight: 0.75 },
            ]}
            filters={[statusFilter.props, riskFilter.props]}
        />
    )
}
