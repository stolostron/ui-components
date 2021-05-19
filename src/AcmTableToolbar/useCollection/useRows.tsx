import { ICell, IRow } from '@patternfly/react-table'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { ICollection, SelectedCollection } from './collection'

export type IHeader<T> = ICell & {
    cellFn: (item: Readonly<T>) => ReactNode
}

export type cellFn<T> = (item: Readonly<T>) => ReactNode

export function useRows<T>(source: ICollection<T>, selected: SelectedCollection<T>, cellFns: cellFn<T>[]): IRow[] {
    const [rows, setRows] = useState<IRow[]>([])
    const existingRows = useRef<{
        map: Record<
            string,
            {
                selected: boolean
                item: T
                row: IRow
            }
        >
    }>({ map: {} })

    const updateRows = useCallback(() => {
        const existingKeys = Object.keys(existingRows.current.map)
        const items = source.items()

        let index = 0
        let change = false
        const newRows: IRow[] = []
        for (const item of items) {
            const key = source.getKey(item)
            const existing = existingRows.current.map['id-' + key]
            if (existing && existing.item === item && existing.selected === selected.includes(key)) {
                newRows.push(existing.row)
                if (index !== existingKeys.indexOf('id-' + key)) change = true
            } else {
                newRows.push({
                    selected: selected.includes(item),
                    cells: cellFns.map((cellFn) => cellFn(item)),
                })
                change = true
            }
            index++
        }
        if (change) {
            const newExisiting: Record<string, { selected: boolean; item: T; row: IRow }> = {}
            index = 0
            for (const item of items) {
                const key = source.getKey(item)
                newExisiting['id-' + key] = {
                    selected: selected.includes(key),
                    item,
                    row: newRows[index],
                }
                index++
            }
            existingRows.current.map = newExisiting
            setRows(newRows)
        }
    }, [source, selected])

    useEffect(() => updateRows(), [updateRows])

    useEffect(() => {
        source.addListener('change', updateRows)
        selected.addListener('change', updateRows)
        return () => {
            source.removeListener('change', updateRows)
            selected.removeListener('change', updateRows)
        }
    }, [source, selected, updateRows])

    return rows
}
