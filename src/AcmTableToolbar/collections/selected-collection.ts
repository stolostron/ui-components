import { useEffect, useState } from 'react'
import { Collection, CollectionChange, ICollection } from './collection'

export class SelectedCollection<T> extends Collection<T> {
    constructor(private readonly source: ICollection<T>) {
        super(source.getKey)
        this.insert = this.insert.bind(this)
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
    }

    public dispose() {
        super.dispose()
        this.removeAllListeners()
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
        this.source.forEach((_key, item) => {
            this.insert(item)
        })
    }
}

export function useSelectedCollection<T>(source: ICollection<T>): SelectedCollection<T> {
    const [selected] = useState(() => new SelectedCollection<T>(source))
    useEffect(() => () => selected.dispose(), [])
    return selected
}
