import { useEffect, useState } from 'react'
import { Collection, CollectionChange, ICollection } from '../collections/collection'

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
                this.insertItem(change.inserted[key], key)
            }
        }
        if (change.removed) this.removeKeys(Object.keys(change.removed))
        this.resumeEvents()
    }

    public selectAll() {
        this.insertItems(this.source.items())
    }
}

export function useSelectedCollection<T>(source: ICollection<T>): SelectedCollection<T> {
    const [selected] = useState(() => new SelectedCollection<T>(source))
    useEffect(() => () => selected.dispose(), [])
    return selected
}
