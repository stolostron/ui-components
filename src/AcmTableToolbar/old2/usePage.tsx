// import { useCallback, useEffect, useState } from 'react'
// import { Collection } from './collection'

// export function usePage<T>(source: Collection<T>, page: number, perPage: number) {
//     const [collection] = useState(new Collection<T>(source.getKey))

//     const getPageItems = useCallback(
//         function () {
//             collection.pause()
//             const firstIndex = (page - 1) * perPage
//             const lastIndex = firstIndex + perPage
//             const pageItems = source.items().slice(firstIndex, lastIndex)

//             for (const key in change?.added) {
//                 const item = change.added[key]
//                 if (filter(item)) {
//                     collection.push(item)
//                 } else {
//                     collection.pop(key)
//                 }
//             }
//             for (const key in change?.replaced) {
//                 const item = change.replaced[key].item
//                 if (filter(item)) {
//                     collection.push(item)
//                 } else {
//                     collection.pop(key)
//                 }
//             }
//             for (const key in change.removed) {
//                 collection.pop(key)
//             }
//             collection.resume()
//         },
//         [source]
//     )

//     useEffect(() => {
//         collection.pause()
//         for (const sourceKey of source.keys()) {
//             const sourceItem = source.item(sourceKey)
//             if (filter(sourceItem)) {
//                 collection.push(sourceItem)
//             } else {
//                 collection.pop(sourceKey)
//             }
//         }
//         for (const collectionKey of collection.keys()) {
//             if (!source.hasKey(collectionKey)) {
//                 collection.pop(collectionKey)
//             }
//         }
//         collection.resume()
//     }, [source, filter])

//     const handleChange = useCallback(
//         function (change: <CollectionChange></CollectionChange><T>) {
//             collection.pause()
//             for (const key in change?.added) {
//                 const item = change.added[key]
//                 if (filter(item)) {
//                     collection.push(item)
//                 } else {
//                     collection.pop(key)
//                 }
//             }
//             for (const key in change?.replaced) {
//                 const item = change.replaced[key].item
//                 if (filter(item)) {
//                     collection.push(item)
//                 } else {
//                     collection.pop(key)
//                 }
//             }
//             for (const key in change.removed) {
//                 collection.pop(key)
//             }
//             collection.resume()
//         },
//         [filter]
//     )

//     useEffect(() => {
//         source.addListener('change', handleChange)
//         return () => {
//             source.removeListener('change', handleChange)
//         }
//     }, [source, handleChange])

//     return collection
// }
