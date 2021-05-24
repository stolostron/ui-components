import faker from 'faker'

export interface Task {
    id: string
    name: string
    status: Status
    risk: Risk
    progress: number
    created: number
    modified?: number
}

export enum Status {
    'Pending',
    'Running',
    'Complete',
    'Cancelled',
    'Error',
}
export const statuses = Object.keys(Status).filter((k) => typeof Status[k as any] === 'number')

export enum Risk {
    'Low',
    'Medium',
    'High',
}
export const risks = Object.keys(Risk).filter((k) => typeof Risk[k as any] === 'number')

function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = (Object.keys(anEnum)
        .map((n) => Number.parseInt(n))
        .filter((n) => !Number.isNaN(n)) as unknown) as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue
}

let id = 0
export function createTask(): Task {
    const task: Task = {
        id: (++id).toString(),
        name: faker.lorem.sentence(8, 3),
        progress: 0,
        status: Status.Pending,
        risk: randomEnum(Risk),
        created: Date.now(),
    }
    return task
}

export function createTasks(count: number): Task[] {
    return new Array<Task>(count).fill((null as unknown) as Task).map(() => createTask())
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
