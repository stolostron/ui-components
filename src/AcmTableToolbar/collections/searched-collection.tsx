import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { CollectionChange, CollectionEmitter, ICollection } from '../collections/collection'
import { compareNumbers } from './compare-items'

export class SearchedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private results?: Fuse.FuseResult<T>[]
    private searchOptions?: Fuse.IFuseOptions<T>

    public readonly getKey: (item: Readonly<T>) => string

    constructor(
        private readonly source: ICollection<T>,
        searchKeys?: Fuse.FuseOptionKey[],
        private searchString?: string
    ) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.setSearchKeys(searchKeys)
        this.search()
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public get length() {
        if (this.results !== undefined) {
            return this.results.length
        } else {
            return this.source.length
        }
    }

    public items(start?: number, end?: number): ReadonlyArray<Readonly<T>> {
        if (this.results !== undefined) {
            if (start !== undefined) {
                return this.results.map((result) => result.item).slice(start, end)
            } else {
                return this.results.map((result) => result.item)
            }
        } else {
            return this.source.items(start, end)
        }
    }

    public setSearch(searchString?: string) {
        this.searchString = searchString
        this.search()
    }

    public setSearchKeys(searchKeys?: Fuse.FuseOptionKey[]) {
        if (searchKeys) {
            this.searchOptions = {
                keys: searchKeys,
                shouldSort: true,
                includeScore: true,
            }
        } else {
            this.searchOptions = undefined
        }
        this.search()
    }

    private search() {
        this.results = undefined
        if (this.processTimeout) {
            clearTimeout(this.processTimeout)
            this.processTimeout = undefined
        }
        if (this.searchString && this.searchOptions) {
            this.results = []
            this.processQueue = [...this.source.items()]
            this.process()
        }
        this.orderedEvent()
    }

    processTimeout?: NodeJS.Timeout
    processQueue?: T[]
    private process() {
        if (this.results && this.searchString && this.processQueue && this.processQueue.length > 0) {
            let start = Date.now()
            const fuse = new Fuse<T>([], this.searchOptions)
            do {
                fuse.setCollection(this.processQueue.splice(0, 500))
                const results = fuse.search(this.searchString)
                this.results = [...this.results, ...results]
            } while (Date.now() - start < 50)
            this.results.sort((lhs, rhs) => -compareNumbers(lhs.score, rhs.score))
            this.orderedEvent()
            this.processTimeout = setTimeout(() => this.process(), 0)
        }
    }

    private handleChange(change: CollectionChange<T>) {
        if (this.results) {
            this.results = this.results.filter((result) => {
                const key = this.getKey(result.item)
                if (change.inserted?.[key]) return false
                if (change.removed?.[key]) return false
                return true
            })
            if (this.processQueue) {
                this.processQueue = this.processQueue.filter((item) => {
                    const key = this.getKey(item)
                    if (change.inserted?.[key]) return false
                    if (change.removed?.[key]) return false
                    return true
                })
            }

            if (change.inserted && this.searchString) {
                const fuse = new Fuse<T>(Object.values(change.inserted), this.searchOptions)
                const results = fuse.search(this.searchString)
                this.results = [...this.results, ...results]
                this.results.sort((lhs, rhs) => -compareNumbers(lhs.score, rhs.score))
            }
        }
        this.orderedEvent()
    }
}

export function useSearchedCollection<T>(
    source: ICollection<T>,
    search: string,
    searchKeys: Fuse.FuseOptionKey[]
): SearchedCollection<T> {
    const [searched] = useState(() => new SearchedCollection<T>(source))
    useEffect(() => searched.setSearchKeys(searchKeys), [searchKeys])
    useEffect(() => searched.setSearch(search), [search])
    useEffect(() => () => searched.dispose(), [])
    return searched
}
