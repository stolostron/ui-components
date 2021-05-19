import { ICell, IRow } from '@patternfly/react-table'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ICollection, SelectedCollection } from './collection'

export type IHeader<T> = ICell & {
    cellFn: (item: Readonly<T>) => ReactNode
}

export type cellFn<T> = (item: Readonly<T>) => ReactNode

export function useRows<T>(source: ICollection<T>, selected: SelectedCollection<T>, cellFns: cellFn<T>[]): IRow[] {
    const [rows, setRows] = useState<IRow[]>([])

    const updateRows = useCallback(() => {
        const newRows: IRow[] = source.items().map((item) => ({
            selected: selected.includes(item),
            cells: cellFns.map((cellFn) => cellFn(item)),
        }))
        // TODO - only update if rows change
        setRows(newRows)
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
