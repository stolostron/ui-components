import { useCallback, useEffect, useState } from 'react'
import { ReadOnlyCollection, CollectionChange, Collection } from './collection'

export class Selected<T> extends Collection<T> {
    constructor(private readonly source: ReadOnlyCollection<T>, debounce?: number) {
        super(source.getKey, debounce)
    }

    public isSelected(item: T): boolean {
        const key = this.getKey(item)
        if (!this.hasKey(key)) return false
        if (this.item(key) !== item) return false
        return true
    }

    public isSelectedKey(key: string): boolean {
        return this.hasKey(key)
    }

    public selectItem(item: T) {
        this.selectKey(this.getKey(item))
    }

    public selectKey(key: string) {
        this.insert(this.item(key))
    }

    public selectKeys(keys: Readonly<string[]>) {
        this.pause()
        keys.forEach(this.selectKey)
        this.resume()
    }

    public selectAll() {
        this.selectKeys(this.source.keys())
    }
}

export function useSelection<T>(source: ReadOnlyCollection<T>): Selected<T> {
    const [selected] = useState(new Selected<T>(source))

    useEffect(() => selected.clear(), [source])

    const handleChange = useCallback(function (change: CollectionChange<T>) {
        selected.pause()
        for (const replacedKey in change?.replaced) {
            if (selected.hasKey(replacedKey)) {
                selected.insert(change.replaced[replacedKey])
            }
        }
        for (const removedKey in change?.removed) {
            selected.remove(removedKey)
        }
        selected.resume()
    }, [])

    useEffect(() => {
        source.addListener('change', handleChange)
        return () => {
            source.removeListener('change', handleChange)
        }
    }, [source, handleChange])

    return selected
}
