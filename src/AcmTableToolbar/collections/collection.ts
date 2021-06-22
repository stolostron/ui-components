import EventEmitter from 'events'
import { useCallback, useEffect, useState } from 'react'

declare global {
    interface ArrayConstructor {
        isArray(arg: any): arg is ReadonlyArray<any>
    }
}

export interface CollectionChange<T> {
    inserted?: Record<string, T>
    removed?: Record<string, true>
    ordered?: boolean
}

export interface ICollection<T> {
    readonly getKey: (item: Readonly<T>) => string
    on(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    addListener(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    removeListener(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    dispose(): void
    items(): ReadonlyArray<Readonly<T>>
    readonly length: number
}

export declare interface CollectionEmitter<T> {
    on(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): this
}

export class CollectionEmitter<T> extends EventEmitter {
    constructor(public debounce?: number) {
        super()
    }

    private event: CollectionChange<T> | undefined
    private timeout: NodeJS.Timeout | undefined

    public dispose() {
        this.removeAllListeners()
    }

    protected insertEvent(key: string, item: T): void {
        if (this.listenerCount('change') === 0) {
            this.event = undefined
            return
        }

        if (!this.event) this.event = {}
        if (this.event?.removed?.[key]) {
            delete this.event.removed[key]
            if (Object.keys(this.event.removed).length === 0) {
                delete this.event.removed
            }
        }
        if (!this.event.inserted) this.event.inserted = {}
        this.event.inserted[key] = item
        this.sendEvent()
    }

    protected removeEvent(key: string): void {
        if (this.listenerCount('change') === 0) {
            this.event = undefined
            return
        }

        if (this.event?.inserted?.[key]) {
            delete this.event?.inserted[key]
            if (Object.keys(this.event.inserted).length === 0) {
                delete this.event.inserted
            }
            if (Object.keys(this.event).length === 0) {
                delete this.event
            }
        } else {
            if (!this.event) this.event = {}
            if (!this.event.removed) this.event.removed = {}
            this.event.removed[key] = true
        }
        this.sendEvent()
    }

    protected orderedEvent() {
        if (this.listenerCount('change') === 0) {
            this.event = undefined
            return
        }

        if (!this.event) this.event = {}
        this.event.ordered = true
        this.sendEvent()
    }

    private eventsPaused = 0

    protected pauseEvents() {
        this.eventsPaused++
    }

    protected resumeEvents() {
        this.eventsPaused--
        if (this.eventsPaused === 0) {
            this.sendEvent(true)
        }
    }

    private sendEvent(immediate = false) {
        if (this.eventsPaused) return
        if (!this.event) return
        if (!immediate && this.debounce && this.debounce > 0) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.timeout = undefined
                    this.sendEvent(true)
                }, this.debounce)
            }
        } else {
            const event = this.event
            this.event = undefined
            try {
                this.emit('change', event)
            } catch {
                /* Do nothing */
            }
        }
    }
}

export class ReadOnlyCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    constructor(public readonly getKey: (item: Readonly<T>) => string, debounce?: number) {
        super(debounce)
    }

    protected readonly itemMap: Record<string, T> = {}

    public get length() {
        // TODO optimize... by keeping a count
        return Object.keys(this.itemMap).length
    }

    public includes(key: string | Readonly<T>) {
        if (typeof key !== 'string') {
            key = this.getKey(key)
        }
        return this.itemMap[key] !== undefined
    }

    public items(): ReadonlyArray<Readonly<T>> {
        return Object.values(this.itemMap)
    }

    protected insert(item?: Readonly<T> | ReadonlyArray<Readonly<T>>): boolean {
        if (item === undefined) return false
        if (Array.isArray(item)) {
            let inserted = false
            this.pauseEvents()
            for (const i of item) {
                if (this.insert(i)) {
                    inserted = true
                }
            }
            this.resumeEvents()
            return inserted
        }

        const key = this.getKey(item)
        if (key === undefined) throw new Error('item key cannot be undefined')
        if (typeof key !== 'string') throw new Error(`item key connt be of type ${typeof key}`)

        const existing = this.itemMap[key]
        if (existing === item) return false

        this.itemMap[key] = item
        this.insertEvent(key, item)
        return true
    }

    protected remove(key?: string | ReadonlyArray<string> | Readonly<T> | ReadonlyArray<Readonly<T>>): boolean {
        if (key === undefined) return false

        if (Array.isArray(key)) {
            let removed = false
            this.pauseEvents()
            for (const i of key) {
                if (this.remove(i)) {
                    removed = true
                }
            }
            this.resumeEvents()
            return removed
        }

        if (typeof key !== 'string') {
            key = this.getKey(key)
        }

        const existing = this.itemMap[key]
        if (existing === undefined) return false

        delete this.itemMap[key]
        this.removeEvent(key)
        return true
    }

    protected clear(): void {
        this.remove(Object.keys(this.itemMap))
    }
}

export class Collection<T> extends ReadOnlyCollection<T> {
    public insert(item?: Readonly<T> | ReadonlyArray<Readonly<T>>): boolean {
        return super.insert(item)
    }

    public remove(key?: string | Readonly<string[]> | Readonly<T> | Readonly<T[]>): boolean {
        return super.remove(key)
    }

    public clear(): void {
        return super.clear()
    }

    public pauseEvents() {
        return super.pauseEvents()
    }

    public resumeEvents() {
        return super.resumeEvents()
    }
}

export function useCollectionCount<T>(source: ICollection<T>) {
    const [count, setCount] = useState(source.length)

    const updateCount = useCallback(() => {
        setCount(source.length)
    }, [source])

    useEffect(() => {
        updateCount()
        source.addListener('change', updateCount)
        return () => {
            source.removeListener('change', updateCount)
        }
    }, [source, updateCount])

    return count
}
