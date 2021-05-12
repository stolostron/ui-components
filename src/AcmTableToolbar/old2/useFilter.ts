import { useCallback, useEffect, useState } from 'react'
import { Collection, CollectionChange } from './collection'

export function useFilter<T>(source: Collection<T>, filter: (item: T) => boolean): Collection<T> {
    const [collection] = useState(new Collection<T>(source.getKeyFn()))
    const handleChange = useCallback(function (change: CollectionChange<T>) {
        collection.pause()
        if (change?.added) {
            for (const key in change.added) {
                const item = change.added[key]
                if (filter(item)) {
                    collection.push(item)
                } else {
                    collection.pop(key)
                }
            }
        }
        if (change?.replaced) {
            for (const key in change.replaced) {
                const item = change.replaced[key].item
                if (filter(item)) {
                    collection.push(item)
                } else {
                    collection.pop(key)
                }
            }
        }
        if (change?.removed) {
            for (const key in change.removed) {
                collection.pop(key)
            }
        }
        collection.resume()
    }, [])
    useEffect(() => {
        collection.addListener('change', handleChange)
        return () => {
            collection.removeListener('change', handleChange)
        }
    }, [source])
    return collection
}
