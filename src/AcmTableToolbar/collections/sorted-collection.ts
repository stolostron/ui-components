import { useEffect, useRef } from 'react'
import { CollectionChange, CollectionEmitter, ICollection } from './collection'

export interface ISort<T> {
    id: string
    text: string
    direction: 'asc' | 'desc'
    sortFn?: (lhs: Readonly<T>, rhs: Readonly<T>) => number
}

export class SortedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private sortedItems?: T[]

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private sortObj?: ISort<T>) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setSort(sortObj)
    }

    public get length() {
        return this.sortedItems?.length ?? 0
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setSort(sortObj?: ISort<T>) {
        if (this.sortObj !== sortObj) {
            this.sortObj = sortObj
            this.sort()
        }
    }

    public sort() {
        if (this.sortObj) {
            this.sortedItems = [...this.source.items()].sort(this.sortObj.sortFn)
            if (this.sortObj.direction === 'desc') {
                this.sortedItems.reverse()
            }
            this.orderedEvent()
        } else if (this.sortedItems) {
            this.sortedItems = undefined
            this.orderedEvent()
        }
    }

    private handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        this.sort()
        for (const key in change.inserted) {
            this.insertEvent(key, change.inserted[key])
        }
        for (const key in change.removed) {
            this.removeEvent(key)
        }
        this.orderedEvent()
        this.resumeEvents()
    }

    public items(): ReadonlyArray<Readonly<T>> {
        if (this.sortedItems) {
            return this.sortedItems
        } else {
            return this.source.items()
        }
    }
}

export function useSortedCollection<T>(source: ICollection<T>, sort?: ISort<T>): SortedCollection<T> {
    const sortedRef = useRef({ sorted: new SortedCollection<T>(source) })
    useEffect(() => sortedRef.current.sorted.setSort(sort), [sort])
    useEffect(() => () => sortedRef.current.sorted.dispose(), [])
    return sortedRef.current.sorted
}
