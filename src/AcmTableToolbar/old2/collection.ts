import EventEmitter from 'events'

export interface CollectionChange<T> {
    added?: Record<string, T>
    removed?: Record<string, T>
    replaced?: Record<string, T>
}

export declare interface ReadOnlyCollection<T> {
    on(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): this
}

export class ReadOnlyCollection<T> extends EventEmitter {
    constructor(public readonly getKey: (item: T) => string, protected readonly debounce?: number) {
        super()
    }

    private readonly itemMap: Record<string, T> = {}
    private event: CollectionChange<T> | undefined
    private timeout: NodeJS.Timeout | undefined

    public dispose() {
        this.removeAllListeners()
    }

    protected insert(item: T | T[]): boolean {
        if (item === undefined) return false

        if (Array.isArray(item)) {
            let inserted = false
            this.pause()
            for (const i of item) {
                if (this.insert(i)) {
                    inserted = true
                }
            }
            this.resume()
            return inserted
        }

        const key = this.getKey(item)
        if (key === undefined) throw new Error('item key cannot be undefined')
        if (typeof key !== 'string') throw new Error(`item key connt be of type ${typeof key}`)

        const existing = this.itemMap[key]
        if (existing === item) return false

        this.itemMap[key] = item

        if (this.listenerCount('change')) {
            if (!this.event) this.event = {}
            if (existing !== undefined) {
                if (this.event?.added?.[key]) {
                    this.event.added[key] = item
                } else if (this.event?.replaced?.[key]) {
                    this.event.replaced[key] = item
                } else {
                    if (!this.event) this.event = {}
                    if (!this.event.replaced) this.event.replaced = {}
                    this.event.replaced[key] = item
                }
            } else {
                if (!this.event) this.event = {}
                if (!this.event.added) this.event.added = {}
                this.event.added[key] = item
            }

            this.sendEvent()
        } else {
            this.event = undefined
        }

        return true
    }

    protected remove(key: string | string[] | T | T[]): boolean {
        if (Array.isArray(key)) {
            let removed = false
            for (const i of key) {
                if (this.remove(i)) {
                    removed = true
                }
            }
            return removed
        }

        if (typeof key !== 'string') {
            key = this.getKey(key)
        }

        const existing = this.itemMap[key]
        if (existing === undefined) return false

        delete this.itemMap[key]

        if (this.listenerCount('change')) {
            if (this.event?.added?.[key]) {
                delete this.event?.added[key]
                if (Object.keys(this.event.added).length === 0) {
                    delete this.event.added
                }
                if (Object.keys(this.event).length === 0) {
                    delete this.event
                }
            } else if (this.event?.replaced?.[key]) {
                delete this.event.replaced[key]
                if (Object.keys(this.event.replaced).length === 0) {
                    delete this.event.replaced
                }
                if (Object.keys(this.event).length === 0) {
                    delete this.event
                }
            } else {
                if (!this.event) this.event = {}
                if (!this.event.removed) this.event.removed = {}
                this.event.removed[key] = existing
            }
            this.sendEvent()
        } else {
            this.event = undefined
        }

        return true
    }

    public keys(): Readonly<string[]> {
        return Object.keys(this.itemMap)
    }

    public hasKey(key: string) {
        return this.itemMap[key] !== undefined
    }

    public items(): Readonly<Readonly<T>[]> {
        return Object.values(this.itemMap)
    }

    public item(key: string): Readonly<T> {
        return this.itemMap[key]
    }

    public forEach(fn: (item: Readonly<T>) => void): void {
        for (const key of this.keys()) {
            fn(this.item(key) as Readonly<T>)
        }
    }

    protected clear(): void {
        this.pause()
        for (const key of this.keys()) {
            this.remove(key)
        }
        this.resume()
    }

    private sendEvent(immediate = false) {
        if (!this.event) return
        if (this.isPaused) return
        if (!immediate && this.debounce) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.timeout = undefined
                    const event = this.event
                    this.event = undefined
                    try {
                        this.emit('change', event)
                    } catch {
                        /* Do nothing */
                    }
                }, this.debounce)
            }
        } else {
            const event = this.event
            this.event = undefined
            this.emit('change', event)
        }
    }

    private isPaused = 0

    protected pause() {
        this.isPaused++
    }

    protected resume() {
        this.isPaused--
        if (this.isPaused === 0) {
            this.sendEvent(true)
        }
    }
}

export class Collection<T> extends ReadOnlyCollection<T> {
    constructor(getKey: (item: T) => string, debounce?: number) {
        super(getKey, debounce)
    }

    public insert(item: T | T[]): boolean {
        return super.insert(item)
    }

    public remove(key: string): boolean {
        return super.remove(key)
    }

    public clear(): void {
        return super.clear()
    }

    public pause() {
        return super.pause()
    }

    public resume() {
        return super.resume()
    }
}

export class SortedCollection<T> extends ReadOnlyCollection<T> {
    private sortedItems: T[]

    constructor(
        private source: ReadOnlyCollection<T>,
        private compareFn: (lhs: T, rhs: T) => number,
        debounce?: number
    ) {
        super(source.getKey, debounce)
        source.addListener('change', this.handleChange)
        this.compareFn = compareFn
        this.sortedItems = [...source.items()].sort(compareFn)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setSource(source: ReadOnlyCollection<T>) {
        this.pause()
        this.sortedItems = [...source.items()].sort(this.compareFn)
        this.resume()
    }

    public setCompare(compareFn: (lhs: T, rhs: T) => number) {
        if (compareFn !== this.compareFn) {
            this.compareFn = compareFn
            this.sort()
        }
    }

    public sort() {
        this.sortedItems = this.sortedItems.sort(this.compareFn)
    }

    handleChange(change: CollectionChange<T>) {
        this.pause()
        if (change.added) this.insert(Object.values(change.added))
        if (change.replaced) this.insert(Object.values(change.replaced))
        if (change.removed) this.remove(Object.keys(change.removed))

        // TODO...
        this.sortedItems = this.sortedItems.sort(this.compareFn)
        this.resume()
    }

    public items(): Readonly<Readonly<T>[]> {
        return this.sortedItems
    }

    public forEach(fn: (item: T) => void): void {
        for (const item of this.sortedItems) {
            fn(item)
        }
    }
}

export class FilteredCollection<T> extends ReadOnlyCollection<T> {
    constructor(private source: ReadOnlyCollection<T>, private filterFn: (item: T) => boolean, debounce?: number) {
        super(source.getKey, debounce)
        source.addListener('change', this.handleChange)
        this.filterFn = filterFn
        this.filter()
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setSource(source: ReadOnlyCollection<T>) {
        this.source = source
        this.pause()
        for (const sourceKey of source.keys()) {
            const sourceItem = source.item(sourceKey)
            if (this.filterFn(sourceItem)) {
                this.insert(sourceItem)
            } else {
                this.remove(sourceKey)
            }
        }
        for (const collectionKey of this.keys()) {
            if (!source.hasKey(collectionKey)) {
                this.remove(collectionKey)
            }
        }
        this.resume()
    }

    public setFilter(filterFn: (item: T) => boolean) {
        if (filterFn !== this.filterFn) {
            this.filterFn = filterFn
            this.filter()
        }
    }

    public filter() {
        this.source.forEach((item) => {
            if (this.filterFn(item)) {
                this.insert(item)
            } else {
                this.remove(this.getKey(item))
            }
        })
    }

    handleChange(change: CollectionChange<T>) {
        this.pause()
        for (const key in change?.added) {
            const item = change.added[key]
            if (this.filterFn(item)) {
                this.insert(item)
            }
        }
        for (const key in change?.replaced) {
            const item = change.replaced[key]
            if (this.filterFn(item)) {
                this.insert(item)
            } else {
                this.remove(key)
            }
        }
        for (const key in change.removed) {
            this.remove(key)
        }
        this.resume()
    }
}
