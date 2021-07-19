import { ICell } from '@patternfly/react-table'
import { ICollection, SelectedCollection } from './collections'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

export type cellFn<T> = (item: Readonly<T>) => ReactNode

export interface IRowColumn<T> extends ICell {
    cellFn: cellFn<T>
}

export interface IRow<T> {
    selected: boolean
    item: T
    cells: ReactNode[]
}

export function useRows<T>(
    source: ICollection<T>,
    selected: SelectedCollection<T>,
    columns: IRowColumn<T>[]
): IRow<T>[] {
    const [rows, setRows] = useState<IRow<T>[]>([])
    const existingRows = useRef<{
        map: Record<string, IRow<T>>
        states: IRow<T>[]
    }>({ map: {}, states: [] })

    const updateRows = useCallback(() => {
        const items = source.items()

        let change = false

        const newStates: IRow<T>[] = []
        for (const item of items) {
            const key = source.getKey(item)
            const existing = existingRows.current.map[key]
            const isSelected = selected.includes(item)
            if (existing && existing.item === item && existing.selected === isSelected) {
                newStates.push(existing)
            } else {
                change = true
                newStates.push({
                    selected: isSelected,
                    item,
                    cells: columns.map((columns) => columns.cellFn(item)),
                })
            }
        }

        if (!change) {
            // TODO CHECK FOR ORDER CHANGE
            const existingStates = existingRows.current.states
            if (newStates.length !== existingStates.length) {
                change = true
            } else {
                for (let i = 0, len = existingStates.length; i < len; i++) {
                    if (existingStates[i].item !== newStates[i].item) {
                        change = true
                        break
                    }
                }
            }
        }

        if (change) {
            const newMap: Record<string, IRow<T>> = {}
            for (const state of newStates) {
                const key = source.getKey(state.item)
                newMap[key] = state
            }
            existingRows.current.map = newMap
            existingRows.current.states = newStates
            setRows(newStates)
        }
    }, [source, selected, columns])

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
