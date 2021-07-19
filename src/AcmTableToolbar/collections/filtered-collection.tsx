import { useEffect, useState } from 'react'
import { CollectionChange, ICollection, ReadOnlyCollection } from './collection'

export type FilterFn<T = any> = (item: T) => boolean

export class FilteredCollection<T> extends ReadOnlyCollection<T> {
    constructor(private source: ICollection<T>, private filterFn?: (item: T) => boolean) {
        super(source.getKey)
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.filter()
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setFilter(filterFn?: (item: T) => boolean) {
        if (this.filterFn === filterFn) return
        this.filterFn = filterFn
        this.filter()
    }

    private filter() {
        this.pauseEvents()
        // let startTime: number = Date.now()
        if (!this.filterFn) {
            this.insertItems(this.source.items())
            // console.log('Filter Clear', Date.now() - startTime, 'ms')
        } else {
            for (const item of this.source.items()) {
                if (this.filterFn(item)) {
                    this.insertItem(item)
                } else {
                    this.removeKey(this.getKey(item))
                }
            }
            // console.log('Filter Collection', Date.now() - startTime, 'ms')
        }
        this.resumeEvents()
    }

    private handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        if (change.inserted) {
            // let startTime = Date.now()
            if (!this.filterFn) {
                this.insertItemMap(change.inserted)
                // console.log('Filter Change Inserted', Date.now() - startTime, 'ms')
            } else {
                for (const key in change.inserted) {
                    const item = change.inserted[key]
                    if (this.filterFn(item)) {
                        this.insertItem(item, key)
                    } else {
                        this.removeKey(key)
                    }
                }
                // console.log('Filter Change Filtered', Date.now() - startTime, 'ms')
            }
        }
        if (change.removed) {
            // let startTime = Date.now()
            this.removeKeys(Object.keys(change.removed))
            // console.log('Filter Change Removed', Date.now() - startTime, 'ms')
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
