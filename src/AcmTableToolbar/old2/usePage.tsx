import { ICell, IRow } from '@patternfly/react-table'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Collection } from './collection'

export type IHeader<T> = ICell & {
    cellFn: (item: Readonly<T>) => ReactNode
}

export function usePage<T>(
    source: Collection<T>,
    selected: Collection<T>,
    columns: IHeader<T>[],
    page: number,
    perPage: number
) {
    const [items, setItems] = useState<Readonly<T[]>>([])

    const handleChange = useCallback(() => {
        const firstIndex = (page - 1) * perPage
        const lastIndex = firstIndex + perPage
        const newItems = source.items().slice(firstIndex, lastIndex)
        if (items.length !== newItems.length) {
            setItems(newItems)
        } else {
            let change = false
            for (let i = 0, len = items.length; i < len; i++) {
                if (items[i] !== newItems[i]) {
                    change = true
                    break
                }
            }
            if (change) {
                setItems(newItems)
            }
        }
    }, [source, items])

    useEffect(() => {
        source.addListener('change', handleChange)
        return () => {
            source.removeListener('change', handleChange)
        }
    }, [source, handleChange])

    useEffect(() => {
        handleChange()
    }, [])

    const rows = useMemo<IRow[]>(() => {
        return items.map((item) => {
            return {
                selected: selected.value(selected.getKey(item)) !== undefined,
                cells: columns.map((column) => column.cellFn(item)),
            }
        })
    }, [items])

    return useMemo(() => ({ cells: columns, rows }), [columns, rows])
}
