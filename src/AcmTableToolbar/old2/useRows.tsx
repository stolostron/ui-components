import { ICell, IRow } from '@patternfly/react-table'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ReadOnlyCollection } from './collection'
import { Selected } from './useSelection'

export type IHeader<T> = ICell & {
    cellFn: (item: Readonly<T>) => ReactNode
}

export type cellFn<T> = (item: Readonly<T>) => ReactNode

export function useRows<T>(source: ReadOnlyCollection<T>, selected: Selected<T>, cellFns: cellFn<T>[]): IRow[] {
    const [rows, setRows] = useState<IRow[]>([])
    // const [items, setItems] = useState<T[]>([])

    // TODO optimize to only send out changes...
    useEffect(() => {
        const rows: IRow[] = []
        source.forEach((item) => {
            rows.push({
                selected: selected.isSelected(item),
                cells: cellFns.map((cellFn) => cellFn(item)),
            })
        })
        setRows(rows)
    }, [source])

    const handleChange = useCallback(() => {
        const rows: IRow[] = []
        source.forEach((item) => {
            rows.push({
                selected: selected.isSelected(item),
                cells: cellFns.map((cellFn) => cellFn(item)),
            })
        })
        setRows(rows)
    }, [source])

    useEffect(() => {
        source.addListener('change', handleChange)
        return () => {
            source.removeListener('change', handleChange)
        }
    }, [source, handleChange])

    return rows
}
