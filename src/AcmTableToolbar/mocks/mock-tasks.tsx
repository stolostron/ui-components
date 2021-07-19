import { Label, LabelGroup, Progress, ProgressSize, Spinner, Text } from '@patternfly/react-core'
import SuccessIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon'
import ErrorIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon'
import ExclamationIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon'
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon'
import { sortable } from '@patternfly/react-table'
import faker from 'faker'
import React, { Fragment, useEffect, useState } from 'react'
import { IRowColumn, ITableAction, ITableFilter } from '..'
import { Collection } from '../collections'

export interface Task {
    id: string
    name: string
    description: string
    status: Status
    risk: Risk
    progress: number
    created: number
    modified?: number
    labels: string[]
}

export enum Status {
    'Pending' = 'Pending',
    'Running' = 'Running',
    'Complete' = 'Complete',
    'Cancelled' = 'Cancelled',
    'Error' = 'Error',
}
export const statuses = Object.keys(Status)

export enum Risk {
    'Low' = 'Low',
    'Medium' = 'Medium',
    'High' = 'High',
}
export const risks = Object.keys(Risk)

function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue
}

let id = 0
export function createTask(): Task {
    const taskId = ++id
    const task: Task = {
        id: taskId.toString(),
        name: `Task ${taskId}`,
        description: faker.lorem.sentence(8, 3),
        progress: 0,
        status: Status.Pending,
        risk: randomEnum(Risk),
        created: Date.now(),
        labels: new Array(Math.ceil(Math.random() * 10))
            .fill('')
            .map(() => faker.hacker.noun())
            .reduce((previousValue, currentValue, currentIndex, array) => {
                if (currentIndex === array.indexOf(currentValue)) {
                    previousValue.push(currentValue)
                }
                return previousValue
            }, [] as string[])
            .sort(),
    }
    return task
}

export function createTasks(count: number): Task[] {
    return new Array<Task>(count).fill(null as unknown as Task).map(() => createTask())
}

export function updateTask(task: Task): Task {
    const newTask = { ...task }
    let change = false
    if (newTask.progress < 100) {
        newTask.status = Status.Running
        newTask.progress += 1
        change = true
        if (newTask.progress === 100) {
            if (Math.random() < 0.5) {
                newTask.status = Status.Complete
            } else {
                newTask.status = Status.Error
            }
            change = true
        }
    }
    if (change) {
        newTask.modified = Date.now()
        return newTask
    }
    return task
}

export function updateRandomTask(tasks: ReadonlyArray<Task>) {
    const randomIndex = Math.floor(Math.random() * tasks.length)
    return updateTask(tasks[randomIndex])
}

export function useMockTasks(count: number, debounce: number): Collection<Task> {
    const [collection] = useState(() => new Collection<Task>((task) => task.id, debounce))
    useEffect(() => {
        collection.debounce = debounce
    }, [debounce])
    useEffect(() => {
        collection.insertItems(createTasks(count))
    }, [count])
    useEffect(() => {
        setInterval(() => {
            const task = updateRandomTask(collection.items())
            collection.insertItem(task)
        }, 0)
    }, [])
    return collection
}

export const taskColumns: IRowColumn<Task>[] = [
    {
        title: 'Name',
        cellFn: (item: Task) => (
            <Fragment>
                <Text>{item.name}</Text>
                <Text component="small" style={{ minWidth: '200px' }}>
                    {item.description}
                </Text>
            </Fragment>
        ),
        transforms: [sortable],
    },
    {
        title: 'Status',
        cellFn: (item: Task) => (
            <span style={{ whiteSpace: 'nowrap' }}>
                {item.progress === 100 ? (
                    <Fragment>
                        {item.status === Status.Complete ? (
                            <Fragment>
                                <SuccessIcon size="sm" color="var(--pf-global--success-color--100)" />
                                &nbsp;&nbsp;
                                {Status[item.status]}
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ErrorIcon size="sm" color="var(--pf-global--danger-color--100)" />
                                &nbsp;&nbsp;
                                {Status[item.status]}
                            </Fragment>
                        )}
                    </Fragment>
                ) : item.progress === 0 ? (
                    <Fragment>
                        <PendingIcon size="sm" color="var(--pf-global--info-color--100)" />
                        &nbsp;&nbsp;
                        {Status[item.status]}
                    </Fragment>
                ) : (
                    <Progress
                        value={item.progress}
                        isTitleTruncated
                        title={
                            <span style={{ whiteSpace: 'nowrap' }}>
                                <Spinner size="sm" />
                                &nbsp;&nbsp;
                                {item.status}
                            </span>
                        }
                        style={{ gridRowGap: '8px' }}
                        size={ProgressSize.sm}
                    />
                )}
            </span>
        ),
        transforms: [sortable],
    },
    {
        title: 'Risk',
        cellFn: (item: Task) => (
            <span style={{ whiteSpace: 'nowrap' }}>
                {item.risk === Risk.High ? (
                    <Fragment>
                        <ErrorIcon size="sm" color="var(--pf-global--danger-color--100)" /> &nbsp;
                        {item.risk}
                    </Fragment>
                ) : item.risk === Risk.Medium ? (
                    <Fragment>
                        <ExclamationIcon size="sm" color="var(--pf-global--warning-color--100)" /> &nbsp;
                        {item.risk}
                    </Fragment>
                ) : (
                    <Fragment>
                        <ExclamationIcon size="sm" color="var(--pf-global--info-color--100)" /> &nbsp;
                        {item.risk}
                    </Fragment>
                )}
            </span>
        ),
        transforms: [sortable],
    },
    {
        title: 'Labels',
        cellFn: (item: Task) => (
            <div style={{ minWidth: '400px' }}>
                <LabelGroup>
                    {item.labels.map((label) => (
                        <Label key={label}>{label}</Label>
                    ))}
                </LabelGroup>
            </div>
        ),
    },
]

export const taskStatusFilter: ITableFilter<Task> = {
    label: 'Status',
    options: statuses,
    filterItem: (statuses: string[], task: Task) => statuses.includes(task.status),
}

export const taskRiskFilter: ITableFilter<Task> = {
    label: 'Risk',
    options: risks,
    filterItem: (risks: string[], task: Task) => risks.includes(task.risk),
}

export const tasksPrimaryAction: ITableAction<Task> = {
    id: 'tasks-primary-action',
    label: 'Primary',
    variant: 'primary',
    action: () => {},
}

export const tasksSecondaryAction: ITableAction<Task> = {
    id: 'tasks-secondary-action',
    label: 'Secondary',
    variant: 'secondary',
    action: () => {},
}

export const tasksErrorAlertAction: ITableAction<Task> = {
    id: 'tasks-error-alert-action',
    label: 'Error alert',
    action: () => {},
}

export const tasksWarningAlertAction: ITableAction<Task> = {
    id: 'tasks-warning-alert-action',
    label: 'Warning alert',
    action: () => {},
}
