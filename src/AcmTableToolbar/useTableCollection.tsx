import { ISortBy } from '@patternfly/react-table'
import Fuse from 'fuse.js'
import { useCallback, useState } from 'react'
import {
    ICollection,
    SortFn,
    useCollectionCount,
    usePagedCollection,
    useSearchedCollection,
    useSelectedCollection,
    useSortedCollection,
} from './collections'

export interface ISort {
    index: number
    direction: 'asc' | 'desc'
}

export function useTableCollection<T>(
    collection: ICollection<T>,
    searchKeys?: Fuse.FuseOptionKey[],
    defaultSort?: ISort
) {
    const itemCount = useCollectionCount(collection)

    const [sortBy, setSortBy] = useState<ISortBy>()

    const [search, setSearchInternal] = useState('')
    const setSearch = useCallback(
        (search: string) => {
            if (search) {
                setSortBy(undefined)
            } else {
                if (sortBy && defaultSort) setSortBy(defaultSort)
            }
            setSearchInternal(search)
        },
        [sortBy]
    )
    const searched = useSearchedCollection<T>(collection, search, searchKeys ?? [])
    const searchedCount = useCollectionCount(searched)

    const [sortFn, setSortFn] = useState<SortFn<T> | undefined>()
    const sorted = useSortedCollection<T>(searched, sortFn)
    const sortedCount = useCollectionCount(sorted)

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const paged = usePagedCollection<T>(sorted, page, perPage)
    const pagedCount = useCollectionCount(paged)

    const selected = useSelectedCollection<T>(collection)
    const selectedCount = useCollectionCount(selected)

    const onSelectNone = useCallback(() => {
        selected.clear()
    }, [selected])
    const onSelectPage = useCallback(() => {
        selected.insertItems(paged.items())
    }, [selected, paged])
    const onSelectAll = useCallback(() => {
        selected.insertItems(searched.items())
    }, [selected, searched])

    return {
        itemCount,
        search,
        setSearch,
        searched,
        searchedCount,
        sortBy,
        setSortBy,
        setSortFn,
        sorted,
        sortedCount,
        page,
        setPage,
        perPage,
        setPerPage,
        paged,
        pagedCount,
        selected,
        selectedCount,
        onSelectNone,
        onSelectPage,
        onSelectAll,
    }
}
