import EventEmitter from 'events'
import { useCallback, useEffect, useState } from 'react'

declare global {
    interface ArrayConstructor {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isArray(arg: any): arg is ReadonlyArray<any>
    }
}

export interface CollectionChange<T> {
    inserted?: Record<string, T>
    removed?: Record<string, T>
    ordered?: boolean
}

export interface ICollection<T> {
    readonly getKey: (item: Readonly<T>) => string
    on(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    addListener(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    removeListener(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): void
    dispose(): void
    readonly length: number
    items(start?: number, end?: number): ReadonlyArray<Readonly<T>>
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

    protected removeEvent(key: string, item: T): void {
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
            this.event.removed[key] = item
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
            this.sendEvent()
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
                // console.log(
                //     'event sent',
                //     event.inserted ? Object.keys(event.inserted).length : 0,
                //     event.removed ? Object.keys(event.removed).length : 0,
                //     event.ordered ?? false
                // )
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
    protected itemMap: Record<string, T> = {}

    public get length() {
        // TODO optimize... by keeping a count
        return Object.keys(this.itemMap).length
    }

    public items(start?: number, end?: number): readonly Readonly<T>[] {
        if (start !== undefined) {
            return Object.values(this.itemMap).slice(start, end)
        } else {
            return Object.values(this.itemMap)
        }
    }

    public includes(key: string | Readonly<T>) {
        if (typeof key !== 'string') {
            key = this.getKey(key)
        }
        return this.itemMap[key] !== undefined
    }

    protected insertItem(item: Readonly<T>, key?: string) {
        if (!key) key = this.getKey(item)
        const existing = this.itemMap[key]
        if (existing === item) return
        this.itemMap[key] = item
        this.insertEvent(key, item)
    }

    protected insertItems(items: ReadonlyArray<Readonly<T>>) {
        this.pauseEvents()
        for (const item of items) {
            this.insertItem(item)
        }
        this.resumeEvents()
    }

    protected insertItemMap(itemMap: Record<string, Readonly<T>>) {
        this.pauseEvents()
        for (const key in itemMap) {
            this.insertItem(itemMap[key], key)
        }
        this.resumeEvents()
    }

    protected removeKey(key: string) {
        const existing = this.itemMap[key]
        if (existing === undefined) return
        delete this.itemMap[key]
        this.removeEvent(key, existing)
    }

    protected removeKeys(keys: string[]) {
        this.pauseEvents()
        for (const key of keys) {
            this.removeKey(key)
        }
        this.resumeEvents()
    }

    protected clear(): void {
        this.removeKeys(Object.keys(this.itemMap))
    }
}

export class Collection<T> extends ReadOnlyCollection<T> {
    public insertItem(item: Readonly<T>, key?: string) {
        return super.insertItem(item, key)
    }

    public insertItems(items: ReadonlyArray<Readonly<T>>) {
        return super.insertItems(items)
    }

    public insertItemMap(itemMap: Record<string, Readonly<T>>) {
        return super.insertItemMap(itemMap)
    }

    public removeKey(key: string) {
        return super.removeKey(key)
    }

    public removeKeys(keys: string[]) {
        return super.removeKeys(keys)
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
