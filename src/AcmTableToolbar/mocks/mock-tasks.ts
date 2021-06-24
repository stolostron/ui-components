import faker from 'faker'
import { useEffect, useRef } from 'react'
import { Collection } from '../collections/collection'

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
    const collectionRef = useRef({ collection: new Collection<Task>((task) => task.id, debounce) })
    useEffect(() => {
        collectionRef.current.collection.debounce = debounce
    }, [debounce])
    useEffect(() => {
        collectionRef.current.collection.insert(createTasks(count))
    }, [count])
    return collectionRef.current.collection
}
