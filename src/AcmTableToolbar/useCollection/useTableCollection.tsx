import { useState } from 'react'
import { ICollection, useCollectionCount } from '../collections/collection'
import { usePagedCollection } from '../collections/paged-collection'
import { ISort, useSortedCollection } from '../collections/sorted-collection'

export function useTableCollection<T>(collection: ICollection<T>) {
    const total = useCollectionCount(collection)

    const [sort, setSort] = useState<ISort<T> | undefined>()
    const sorted = useSortedCollection(collection, sort)

    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const paged = usePagedCollection(sorted, page, pageSize)

    return { total, collection, sort, setSort, sorted, page, setPage, pageSize, setPageSize, paged }
}
