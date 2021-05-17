import { useEffect, useState } from 'react'
import { Collection, FilteredCollection, ReadOnlyCollection, SortedCollection } from './collection'

export function useCollection<T>(items: T[], getKey: (item: T) => string, debounce?: number): ReadOnlyCollection<T> {
    const [collection] = useState(new Collection<T>(getKey, debounce))
    useEffect(() => {
        const itemKeys: Record<string, T> = {}
        const collectionKeys = collection.keys()
        collection.pause()
        collection.insert(items)
        for (const collectionKey of collectionKeys) {
            if (!itemKeys[collectionKey]) {
                collection.remove(collectionKey)
            }
        }
        collection.resume()
    }, [items])
    return collection
}

export function useFilter<T>(source: ReadOnlyCollection<T>, filter: (item: T) => boolean): ReadOnlyCollection<T> {
    const [filtered] = useState(new FilteredCollection<T>(source, filter))
    useEffect(() => filtered.setSource(source), [source])
    useEffect(() => filtered.setFilter(filter), [filter])
    return filtered
}

// OrderedCollection
// export function useSearch<T>(source: ReadOnlyCollection<T>, searchFn: (item: T) => boolean): ReadOnlyCollection<T> {
//     const [searched] = useState(new SearchedCollection<T>(source, searchFn))
//     useEffect(() => searched.setSource(source), [source])
//     useEffect(() => searched.setFilter(searchFn), [searchFn])
//     return searched
// }

// OrderedCollection
export function useSort<T>(source: ReadOnlyCollection<T>, compare: (lhs: T, rhs: T) => number): ReadOnlyCollection<T> {
    const [sorted] = useState(new SortedCollection<T>(source, compare))
    useEffect(() => sorted.setSource(source), [source])
    useEffect(() => sorted.setCompare(compare), [compare])
    return sorted
}

// OrderedCollection
// export function usePage<T>(source: ReadOnlyCollection<T>, page: number, perPage: number): ReadOnlyCollection<T> {
//     const [paged] = useState(new SortedCollection<T>(source, compare))
//     useEffect(() => paged.setSource(source), [source])
//     useEffect(() => paged.setCompare(compare), [compare])
//     return paged
// }
