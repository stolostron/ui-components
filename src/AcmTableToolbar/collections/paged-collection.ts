import { useEffect, useState } from 'react'
import { CollectionEmitter, ICollection, IOrderedCollection } from './collection'

export class PagedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private pagedItems: ReadonlyArray<Readonly<T>> = []

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: IOrderedCollection<T>, private page: number, private pageSize: number) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setPage(page, pageSize)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public get length() {
        return this.pagedItems.length
    }

    public forEach(callback: (key: string, value: T) => void) {
        for (const item of this.pagedItems) {
            const key = this.getKey(item)
            callback(key, item)
        }
    }

    public setPage(page: number, pageSize: number) {
        if (this.page === page && this.pageSize === pageSize) return
        this.page = page
        this.pageSize = pageSize
        this.paginate()
    }

    public paginate() {
        const startIndex = (this.page - 1) * this.pageSize
        const endIndex = startIndex + this.pageSize
        this.pagedItems = this.source.items(startIndex, endIndex)
        this.orderedEvent()
    }

    private handleChange() {
        this.paginate()
    }

    public items(start?: number, end?: number): ReadonlyArray<Readonly<T>> {
        return this.pagedItems.slice(start, end)
    }
}

export function usePagedCollection<T>(
    source: IOrderedCollection<T>,
    page: number,
    perPage: number
): PagedCollection<T> {
    const [paged] = useState(() => new PagedCollection<T>(source, page, perPage))
    useEffect(() => paged.setPage(page, perPage), [page, perPage])
    useEffect(() => () => paged.dispose(), [])
    return paged
}
