import { useEffect, useState } from 'react'
import { CollectionChange, CollectionEmitter, ICollection, IOrderedCollection } from './collection'

export interface ISort<T> {
    id: string
    text: string
    direction: 'asc' | 'desc'
    sortFn?: (lhs: Readonly<T>, rhs: Readonly<T>) => number
}

export class SortedCollection<T> extends CollectionEmitter<T> implements IOrderedCollection<T> {
    private sortedItems: T[] = []

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private sortObj?: ISort<T>) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setSort(sortObj)
    }

    public dispose() {
        super.dispose()
        this.removeAllListeners()
        this.source.removeListener('change', this.handleChange)
    }

    public get length() {
        return this.sortedItems.length
    }

    public items(start?: number, end?: number): ReadonlyArray<Readonly<T>> {
        if (start) return this.sortedItems.slice(start, end)
        else return this.sortedItems
    }

    public forEach(callback: (key: string, value: T) => void) {
        for (const item of this.sortedItems) {
            const key = this.getKey(item)
            callback(key, item)
        }
    }

    public setSort(sortObj?: ISort<T>) {
        this.sortObj = sortObj
        this.sort()
    }

    public sort() {
        this.sortedItems = []
        this.source.forEach((_key, item) => this.sortedItems.push(item))
        if (this.sortObj) {
            this.sortedItems.sort(this.sortObj.sortFn)
            if (this.sortObj.direction === 'desc') {
                this.sortedItems.reverse()
            }
        }
        this.orderedEvent()
    }

    private handleChange(change: CollectionChange<T>) {
        // TODO - efficient sorting....
        this.sort()
    }
}

export function useSortedCollection<T>(source: ICollection<T>, sort?: ISort<T>): SortedCollection<T> {
    const [sorted] = useState(() => new SortedCollection<T>(source))
    useEffect(() => sorted.setSort(sort), [sort])
    useEffect(() => () => sorted.dispose(), [])
    return sorted
}
