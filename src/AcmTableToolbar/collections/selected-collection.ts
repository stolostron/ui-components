import { useEffect, useRef } from 'react'
import { Collection, CollectionChange, ICollection } from './collection'

export class SelectedCollection<T> extends Collection<T> {
    constructor(private readonly source: ICollection<T>) {
        super(source.getKey)
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    private handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        for (const key in change.inserted) {
            if (this.includes(key)) {
                this.insert(change.inserted[key])
            }
        }
        if (change.removed) this.remove(Object.keys(change.removed))
        this.resumeEvents()
    }

    public selectAll() {
        this.insert(this.source.items())
    }
}

export function useSelectedCollection<T>(source: ICollection<T>): SelectedCollection<T> {
    const selectedRef = useRef({ selected: new SelectedCollection<T>(source) })
    useEffect(() => () => selectedRef.current.selected.dispose(), [])
    return selectedRef.current.selected
}
