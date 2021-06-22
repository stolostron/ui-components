import { useEffect, useRef } from 'react'
import { CollectionChange, CollectionEmitter, ICollection } from './collection'

export class PagedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private pagedItems: T[] = []

    public readonly getKey: (item: Readonly<T>) => string

    constructor(private readonly source: ICollection<T>, private page: number, private pageSize: number) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setPage(page, pageSize)
    }

    public get length() {
        return this.pagedItems?.length ?? 0
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setPage(page: number, pageSize: number) {
        if (this.page !== page || this.pageSize !== pageSize) {
            this.page = page
            this.pageSize = pageSize
            this.paginate()
        }
    }

    public paginate() {
        const startIndex = (this.page - 1) * this.pageSize
        const endIndex = startIndex + this.pageSize
        this.pagedItems = this.source.items().slice(startIndex, endIndex)
        // TODO - only send orderedEvent if page items really changed...
        this.orderedEvent()
    }

    private handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        this.paginate()
        // TODO send out inserted and removed events....
        this.resumeEvents()
    }

    public items(): ReadonlyArray<Readonly<T>> {
        return this.pagedItems
    }
}

export function usePagedCollection<T>(source: ICollection<T>, page: number, perPage: number): PagedCollection<T> {
    const pagedRef = useRef({ paged: new PagedCollection<T>(source, page, perPage) })
    useEffect(() => pagedRef.current.paged.setPage(page, perPage), [page, perPage])
    useEffect(() => () => pagedRef.current.paged.dispose(), [])
    return pagedRef.current.paged
}
