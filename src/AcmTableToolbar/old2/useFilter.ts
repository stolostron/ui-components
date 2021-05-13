import { useCallback, useEffect, useState } from 'react'
import { Collection, CollectionChange } from './collection'

export function useFilter<T>(source: Collection<T>, filter: (item: T) => boolean): Collection<T> {
    const [collection] = useState(new Collection<T>(source.getKey))

    useEffect(() => {
        const collectionKeys = collection.keys()
        const sourcekeys = source.keys()
        collection.pause()
        for (const sourceKey of sourcekeys) {
            const sourceItem = source.value(sourceKey)
            if (filter(sourceItem)) {
                collection.push(sourceItem)
            } else {
                collection.pop(sourceKey)
            }
        }
        for (const collectionKey of collectionKeys) {
            if (!source.value(collectionKey)) {
                collection.pop(collectionKey)
            }
        }
        collection.resume()
    }, [source, filter])

    const handleChange = useCallback(
        function (change: CollectionChange<T>) {
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
        },
        [filter]
    )

    useEffect(() => {
        source.addListener('change', handleChange)
        return () => {
            source.removeListener('change', handleChange)
        }
    }, [source, handleChange])

    return collection
}
