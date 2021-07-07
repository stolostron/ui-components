import { useEffect, useState } from 'react'
import { CollectionChange, ICollection, ReadOnlyCollection } from './collection'

export class FilteredCollection<T> extends ReadOnlyCollection<T> {
    private itemQueue: T[] = []

    constructor(private source: ICollection<T>, private filterFn?: (item: T) => boolean) {
        super(source.getKey)
        this.filterItem = this.filterItem.bind(this)
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setFilter(filterFn)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setFilter(filterFn?: (item: T) => boolean) {
        if (this.filterFn === filterFn) return
        this.filterFn = filterFn
        this.itemQueue = []
        this.source.forEach((_key, item) => this.itemQueue.push(item))
        this.filter()
    }

    private filterTimeout: NodeJS.Timeout | undefined

    private filter() {
        if (this.filterTimeout) return
        this.pauseEvents()
        this.filterTimeout = setTimeout(() => this.process(), 0)
    }

    private process() {
        const start = Date.now()
        while (this.itemQueue.length > 0 && Date.now() - start < 100) {
            const item = this.itemQueue.pop()
            if (item) this.filterItem(item)
        }
        if (this.itemQueue.length > 0) {
            this.filterTimeout = setTimeout(() => this.process(), 10)
        } else {
            this.filterTimeout = undefined
            this.resumeEvents()
        }
    }

    private filterItem(item: T) {
        if (!this.filterFn || this.filterFn(item)) {
            this.insert(item)
        } else {
            this.remove(this.getKey(item))
        }
    }

    private handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        this.itemQueue = this.itemQueue.filter((item) => {
            const key = this.getKey(item)
            return change.removed?.[key] !== undefined && change.inserted?.[key] !== undefined
        })
        for (const key in change.inserted) {
            this.itemQueue.push(change.inserted[key])
        }
        for (const key in change.removed) {
            this.remove(key)
        }
        this.resumeEvents()
        this.filter()
    }
}

export function useFilteredCollection<T>(
    source: ICollection<T>,
    filterFn?: (item: T) => boolean
): FilteredCollection<T> {
    const [filtered] = useState(() => new FilteredCollection<T>(source))
    useEffect(() => filtered.setFilter(filterFn), [filterFn])
    useEffect(() => () => filtered.dispose(), [])
    return filtered
}
