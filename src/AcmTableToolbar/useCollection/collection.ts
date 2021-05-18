import EventEmitter from 'events'

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
        if (this.listenerCount('change')) {
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
        if (this.listenerCount('change')) {
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
        if (this.listenerCount('change')) {
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
        if (!this.event) return
        if (this.eventsPaused) return
        if (!immediate && this.debounce && this.debounce > 0) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
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
    constructor(getKey: (item: T) => string, debounce?: number) {
        super(getKey, debounce)
    }

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

export class FilteredCollection<T> extends ReadOnlyCollection<T> {
    constructor(private source: ICollection<T>, private filterFn?: (item: T) => boolean) {
        super(source.getKey)
        source.addListener('change', this.handleChange)
        this.setFilter(filterFn)
        console.log('TTT', source.items().length)
        console.log('TTT', this.items().length)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setFilter(filterFn?: (item: T) => boolean) {
        if (this.filterFn !== filterFn) {
            this.filterFn = filterFn
            this.filter()
        }
    }

    public filter() {
        this.source.items().forEach((item) => {
            if (!this.filterFn || this.filterFn(item)) {
                this.insert(item)
            } else {
                this.remove(this.getKey(item))
            }
        })
    }

    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        if (change?.inserted) {
            for (const item of Object.values(change.inserted)) {
                if (!this.filterFn || this.filterFn(item)) {
                    this.insert(item)
                } else {
                    this.remove(this.getKey(item))
                }
            }
        }
        if (change?.removed) {
            for (const key in change.removed) {
                this.remove(key)
            }
        }
        this.resumeEvents()
    }
}

interface SearchResult<T> {
    value: number
    item: T
}
export class SearchedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private results?: SearchResult<T>[]
    private resultMap?: Record<string, SearchResult<T>>
    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private searchFn?: (item: T) => number) {
        super()
        this.getKey = source.getKey
        source.addListener('change', this.handleChange)
        this.setSearch(searchFn)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setSearch(searchFn?: (item: T) => number) {
        if (this.searchFn !== searchFn) {
            this.searchFn = searchFn
            this.search()
        }
    }

    public search() {
        if (this.searchFn) {
            this.resultMap = {}
            this.results = this.source.items().map((item) => {
                const key = this.source.getKey(item)
                const result = { value: 0, item }
                if (this.resultMap) this.resultMap[key] = result
                return result
            })
        } else {
            this.results = undefined
            this.resultMap = undefined
        }
    }

    // TODO - asynchronous search with cancel...
    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        if (this.results && this.resultMap) {
            let sortNeeded = false

            for (const key in change?.inserted) {
                const item = change.inserted[key]
                let result = this.resultMap[key]
                if (result) {
                    // TODO update Search Result
                    result.item = item
                    // if( resultChanged ) sortNeeded = true
                } else {
                    result = { value: 0, item } // TODO Search Result
                    this.resultMap[key] = result
                    this.results.push(result)
                    sortNeeded = true
                }

                // TODO handle if item does not pass search
                this.insertEvent(key, item)
            }

            if (change.removed) {
                this.results.filter((result) => {
                    const key = this.source.getKey(result.item)
                    let removed = false
                    if (change.removed?.[key] === true) {
                        if (this.resultMap?.[key]) {
                            if (this.resultMap) delete this.resultMap[key]
                            this.removeEvent(key)
                            removed = true
                        }
                    }
                    return !removed
                })
            }

            if (sortNeeded) {
                this.results.sort((l, r) => l.value - r.value)
            }
        }

        this.resumeEvents()
    }

    public items(): Readonly<Readonly<T>[]> {
        if (this.results) {
            return this.results.map((searchResult) => searchResult.item)
        } else {
            return this.source.items()
        }
    }
}

export class SortedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private sortedItems?: T[]

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private compareFn?: (lhs: T, rhs: T) => number) {
        super()
        this.getKey = source.getKey
        source.addListener('change', this.handleChange)
        this.setCompare(compareFn)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setCompare(compareFn?: (lhs: T, rhs: T) => number) {
        if (this.compareFn !== compareFn) {
            this.compareFn = compareFn
            this.sort()
        }
    }

    public sort() {
        if (this.compareFn) {
            this.sortedItems = [...this.source.items()].sort(this.compareFn)
            this.orderedEvent()
        } else if (this.sortedItems) {
            this.sortedItems = undefined
            this.orderedEvent()
        }
    }

    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        this.sort()
        for (const key in change.inserted) {
            this.insertEvent(key, change.inserted[key])
        }
        for (const key in change.removed) {
            this.removeEvent(key)
        }
        this.resumeEvents()
    }

    items(): readonly Readonly<T>[] {
        if (this.sortedItems) {
            return this.sortedItems
        } else {
            return this.source.items()
        }
    }
}

export class PagedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private pagedItems: T[] = []

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private page: number, private pageSize: number) {
        super()
        this.getKey = source.getKey
        source.addListener('change', this.handleChange)
        this.setPage(page, pageSize)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setPage(page: number, pageSize: number) {
        if (this.page !== page || pageSize !== this.pageSize) {
            this.page = page
            this.pageSize = pageSize
            this.paginate()
        }
    }

    public paginate() {
        this.pagedItems = this.source.items().slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        // TODO - only send orderedEvent if page items really changed...
        this.orderedEvent()
    }

    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        this.paginate()
        // TODO send out inserted and removed events....
        this.resumeEvents()
    }

    items(): readonly Readonly<T>[] {
        return this.pagedItems
    }
}

export class SelectedCollection<T> extends Collection<T> {
    constructor(private readonly source: ICollection<T>) {
        super(source.getKey)
        source.addListener('change', this.handleChange)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        if (change.inserted) this.insert(Object.values(change.inserted))
        if (change.removed) this.remove(Object.keys(change.removed))
        this.resumeEvents()
    }

    public selectAll() {
        this.insert(this.source.items())
    }
}
