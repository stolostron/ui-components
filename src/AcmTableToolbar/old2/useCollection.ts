import { useEffect, useState } from 'react'
import { Collection } from './collection'

export function useCollection<T>(items: T[], getKey: (item: T) => string, debounce?: number): Collection<T> {
    const [collection] = useState(new Collection<T>(getKey, debounce))
    useEffect(() => {
        const itemKeys: Record<string, T> = {}
        const collectionKeys = collection.keys()
        collection.pause()
        for (const item of items) {
            itemKeys[getKey(item)] = item
            collection.push(item)
        }
        for (const collectionKey of collectionKeys) {
            if (!itemKeys[collectionKey]) {
                collection.pop(collectionKey)
            }
        }
        collection.resume()
    }, [items])
    return collection
}
