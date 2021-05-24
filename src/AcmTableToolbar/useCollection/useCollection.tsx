import { useEffect, useState } from 'react'
import {
    Collection,
    FilteredCollection,
    ICollection,
    PagedCollection,
    ReadOnlyCollection,
    SearchedCollection,
    SelectedCollection,
    SortedCollection,
} from './collection'

export function useCollection<T>(items: T[], getKey: (item: T) => string, debounce?: number): ReadOnlyCollection<T> {
    const [collection] = useState(new Collection<T>(getKey, debounce))
    useEffect(() => {
        // const itemKeys: Record<string, T> = {}
        // const collectionKeys = collection.keys()
        // collection.pauseEvents()
        // collection.insert(items)
        // for (const collectionKey of collectionKeys) {
        //     if (!itemKeys[collectionKey]) {
        //         collection.remove(collectionKey)
        //     }
        // }
        // collection.resumeEvents()
    }, [items])
    return collection
}

export function useSelection<T>(source: ICollection<T>): SelectedCollection<T> {
    const [selected] = useState(() => new SelectedCollection<T>(source))
    useEffect(() => () => selected.dispose(), [])
    return selected
}

export function useFilter<T>(source: ICollection<T>, filterFn: (item: T) => boolean): FilteredCollection<T> {
    const [filtered] = useState(() => new FilteredCollection<T>(source, filterFn))
    useEffect(() => filtered.setFilter(filterFn), [filterFn])
    useEffect(() => () => filtered.dispose(), [])
    return filtered
}

export function useSearch<T>(source: ICollection<T>, searchFn: (item: T) => number): SearchedCollection<T> {
    const [searched] = useState(() => new SearchedCollection<T>(source, searchFn))
    useEffect(() => searched.setSearch(searchFn), [searchFn])
    useEffect(() => () => searched.dispose(), [])
    return searched
}

export function useSort<T>(source: ICollection<T>, compareFn: (lhs: T, rhs: T) => number): SortedCollection<T> {
    const [sorted] = useState(() => new SortedCollection<T>(source, compareFn))
    useEffect(() => sorted.setCompare(compareFn), [compareFn])
    useEffect(() => () => sorted.dispose(), [])
    return sorted
}

export function usePage<T>(source: ICollection<T>, page: number, perPage: number): PagedCollection<T> {
    const [paged] = useState(() => new PagedCollection<T>(source, page, perPage))
    useEffect(() => paged.setPage(page, perPage), [page, perPage])
    useEffect(() => () => paged.dispose(), [])
    return paged
}
