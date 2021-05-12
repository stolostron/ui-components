import { useEffect, useState } from 'react'
import { Collection } from './collection'

export function useCollection<T>(items: T[], getKey: (item: T) => string): Collection<T> {
    const [collection] = useState(new Collection<T>(getKey))
    useEffect(() => {
        const keys: Record<string, T> = {}
        const collectionKeys = collection.keys()
        collection.pause()
        for (const item of items) {
            keys[getKey(item)] = item
            collection.push(item)
        }
        for (const collectionKey of collectionKeys) {
            if (!keys[collectionKey]) {
                collection.pop(collectionKey)
            }
        }
        collection.resume()
    }, [items])
    return collection
}
