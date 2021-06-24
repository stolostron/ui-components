import { useEffect, useState } from 'react'
import { CollectionChange, ICollection, ReadOnlyCollection } from './collection'

export class FilteredCollection<T> extends ReadOnlyCollection<T> {
    constructor(private source: ICollection<T>, private filterFn?: (item: T) => boolean) {
        super(source.getKey)
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setFilter(filterFn)
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
        this.pauseEvents()
        this.source.items().forEach((item) => {
            if (!this.filterFn || this.filterFn(item)) {
                this.insert(item)
            } else {
                this.remove(this.getKey(item))
            }
        })
        this.resumeEvents()
    }

    private handleChange(change: CollectionChange<T>) {
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

export function useFilteredCollection<T>(
    source: ICollection<T>,
    filterFn?: (item: T) => boolean
): FilteredCollection<T> {
    const [filtered] = useState(() => new FilteredCollection<T>(source))
    useEffect(() => filtered.setFilter(filterFn), [filterFn])
    useEffect(() => () => filtered.dispose(), [])
    return filtered
}
