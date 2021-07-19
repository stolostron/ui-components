import { useEffect, useState } from 'react'
import { CollectionChange, ICollection, CollectionEmitter } from '../collections/collection'

export type SortFn<T> = (lhs: Readonly<T>, rhs: Readonly<T>) => number

export class SortedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private sortedItems?: T[]

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private sortFn?: SortFn<T>) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        if (sortFn) {
            this.sortedItems = [...this.source.items()]
            this.sort()
        }
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public get length() {
        if (this.sortedItems) {
            return this.sortedItems.length
        } else {
            return this.source.length
        }
    }

    public items(start?: number, end?: number): ReadonlyArray<Readonly<T>> {
        if (this.sortedItems) {
            if (start !== undefined) {
                return this.sortedItems.slice(start, end)
            } else {
                return this.sortedItems
            }
        } else {
            return this.source.items(start, end)
        }
    }

    public setSort(sortFn?: SortFn<T>) {
        if (this.sortFn === sortFn) return
        this.sortFn = sortFn
        if (this.sortFn) {
            this.sortedItems = [...this.source.items()]
            this.sort()
        } else {
            this.sortedItems = undefined
            this.orderedEvent()
        }
    }

    private handleChange(_change: CollectionChange<T>) {
        if (this.sortedItems) {
            // let startTime: number = Date.now()
            this.sortedItems = Object.values(this.source.items())
            // console.log('Sort', 'Change', 'Copy', Date.now() - startTime, 'ms')
            this.sort()
        } else {
            this.orderedEvent()
        }
    }

    private sort() {
        if (this.sortedItems) {
            // let startTime: number = Date.now()
            this.sortedItems.sort(this.sortFn)
            // console.log('Sort', 'Collection', Date.now() - startTime, 'ms')
            this.orderedEvent()
        }
    }
}

export function useSortedCollection<T>(source: ICollection<T>, sortFn?: SortFn<T>): SortedCollection<T> {
    const [sorted] = useState(() => new SortedCollection<T>(source))
    useEffect(() => sorted.setSort(sortFn), [sortFn])
    useEffect(() => () => sorted.dispose(), [])
    return sorted
}
