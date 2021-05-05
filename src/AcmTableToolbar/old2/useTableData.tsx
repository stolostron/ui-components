/* Copyright Contributors to the Open Cluster Management project */

import { useCallback, useEffect, useMemo, useState } from 'react'
import EventEmitter from 'events'

export type KeyFn<T> = (item: T) => string
export type FilterFn<T> = (item: T) => boolean
export type SearchFn<T> = (item: T) => number
export type CompareFn<T> = (lhs: T, rhs: T) => number

type ItemChanges<T> = {
    added?: { key: string; added: T }[]
    removed?: { key: string; removed: T }[]
    replaced?: { key: string; item: T; replaced: T }[]
}
function useItemsChanges<T>(items: T[], getKey: KeyFn<T>) {
    const [changes, setChanges] = useState<ItemChanges<T>>({})
    const [existingKeys, setExistingKeys] = useState<Record<string, T>>({})
    useEffect(() => {
        const changes: ItemChanges<T> = {}
        const itemKeys: Record<string, T> = {}
        for (const item of items) {
            const key = getKey(item)
            itemKeys[key] = item
            const existing = existingKeys[key]
            if (!existing) {
                if (!changes.added) changes.added = []
                changes.added.push({ key, added: item })
            } else {
                if (existing !== item) {
                    if (!changes.replaced) changes.replaced = []
                    changes.replaced.push({ key, item, replaced: existing })
                }
            }
        }
        for (const key in existingKeys) {
            if (!itemKeys[key]) {
                if (!changes.removed) changes.removed = []
                changes.removed.push({ key, removed: existingKeys[key] })
            }
        }
        if (changes.added || changes.removed || changes.replaced) {
            setExistingKeys(itemKeys)
            setChanges(changes)
        }
    }, [items])
    return changes
}

function useSelectedItems<T>(items: T[], getKey: KeyFn<T>, changes: ItemChanges<T>) {
    const [selectedKeys, setSelectedKeys] = useState<Record<string, true>>({})
    const [selectedItems, setSelectedItems] = useState<T[]>([])

    const unselectAll = useCallback(() => setSelectedKeys({}), [])
    const selectAll = useCallback(() => setSelectedKeys({}), [items])
    const selectItem = useCallback((item: T) => setSelectedKeys({ ...selectedKeys, ...{ [getKey(item)]: true } }), [
        selectedKeys,
    ])
    const unselectItem = useCallback(
        (item: T) => {
            const newKeys = { ...selectedKeys }
            delete newKeys[getKey(item)]
            setSelectedKeys(newKeys)
        },
        [selectedKeys]
    )

    useEffect(() => {
        let newSelectedKeys: Record<string, true> | undefined = undefined
        if (changes.replaced) {
        }
        if (changes.removed) {
            for (const removed of changes.removed) {
                if (selectedKeys[removed.key]) {
                    if (!newSelectedKeys) newSelectedKeys = { ...selectedKeys }
                    delete newSelectedKeys[removed.key]
                }
            }
        }
        if (newSelectedKeys) {
            setSelectedKeys(newSelectedKeys)
        }
    }, [changes])

    return {
        selectedItems,
        selectItem,
        unselectItem,
        selectAll,
        unselectAll,
    }
}

function useTableData<T>(items: T[], getKey: KeyFn<T>) {
    const collection = useCollection(items, getKey)
    const { selected, select, unselect, selectAll, unselectAll } = useSelect(collection)
    const { filtered, setFilterFn } = useFilter(collection)
    const { searched, setSearchFn } = useSearch(filtered)
    const { sorted, setSortFn } = useSort(searched)
    const { paged, page, setPage, pageSize, setPageSize, pageTotal } = usePage(sorted)
    return {
        paged,
        page,
        setPage,
        pageSize,
        setPageSize,
        pageTotal,
        setFilterFn,
        setSearchFn,
        setSortFn,
    }
}

// function Example() {
//     const {
//         paged,
//         page,
//         setPage,
//         pageSize,
//         setPageSize,
//         pageTotal,
//         setFilterFn,
//         setSearchFn,
//         setSortFn,
//     } = useTableItems(items, getItemKey)

//     return (
//         <table>
//             {paged.map(() => {
//                 return <tr></tr>
//             })}
//         </table>
//     )
// }
