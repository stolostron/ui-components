import { useEffect, useRef } from 'react'
import { Collection, ReadOnlyCollection } from '../collections/collection'

export function useArrayCollection<T>(
    items: T[],
    getKey: (item: T) => string,
    debounce?: number
): ReadOnlyCollection<T> {
    const collectionRef = useRef({ collection: new Collection<T>(getKey, debounce) })
    useEffect(() => {
        collectionRef.current.collection.debounce = debounce
    }, [debounce])
    useEffect(() => {
        const collection = collectionRef.current.collection
        collection.pauseEvents()
        collection.insert(items)
        if (collection.length !== items.length) {
            const itemKeys: Record<string, true> = {}
            for (const item of items) itemKeys[getKey(item)] = true
            for (const item of collection.items()) {
                if (!itemKeys[getKey(item)]) {
                    collection.remove(item)
                }
            }
        }
        collection.resumeEvents()
    }, [items, getKey])
    return collectionRef.current.collection
}
