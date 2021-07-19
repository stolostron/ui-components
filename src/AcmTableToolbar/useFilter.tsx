import { FilterFn, ICollection, useFilteredCollection } from './collections'
import { useEffect, useState } from 'react'
import { ITableFilter, TableFilterProps } from './TableFilter'

export function useFilter<T>(filter: ITableFilter<T>, sourceCollection: ICollection<T>) {
    const [filterFn, setFilterFn] = useState<FilterFn<T>>()

    const [selections, setSelections] = useState<string[]>([])
    useEffect(() => {
        if (selections.length > 0) {
            setFilterFn(() => (item: T) => {
                return filter.filterItem(selections, item)
            })
        } else {
            setFilterFn(undefined)
        }
    }, [selections])

    const collection = useFilteredCollection<T>(sourceCollection, filterFn)
    const props: TableFilterProps<T> = { ...filter, ...{ selections, setSelections } }
    return { props, collection }
}
