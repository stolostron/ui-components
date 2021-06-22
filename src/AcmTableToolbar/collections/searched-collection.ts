import Fuse from 'fuse.js'
import { useEffect, useRef } from 'react'
import { CollectionChange, CollectionEmitter, ICollection } from './collection'
import { compareNumbers } from './compare-items'

export interface ISearch<T> {
    search: string
    searchFn?: (item: T) => number
}

interface SearchResult<T> {
    item: T
    score?: number
}
export class SearchedCollection<T> extends CollectionEmitter<T> implements ICollection<T> {
    private results?: SearchResult<T>[]
    private resultMap?: Record<string, SearchResult<T>>
    private fuse?: Fuse<T>

    public readonly getKey: (item: Readonly<T>) => string

    constructor(
        private readonly source: ICollection<T>,
        private searchOptions?: Fuse.IFuseOptions<T>,
        private searchString?: string
    ) {
        super()
        this.getKey = source.getKey
        this.handleChange = this.handleChange.bind(this)
        source.addListener('change', this.handleChange)
        this.search()
    }

    public get length() {
        return this.results ? this.results.length : this.source.length
    }

    public dispose() {
        super.dispose()
        this.source.removeListener('change', this.handleChange)
    }

    public setSearch(searchString?: string) {
        if (this.searchString !== searchString) {
            this.searchString = searchString
            this.search()
        }
    }

    public setSearchOptions(searchOptions?: Fuse.IFuseOptions<T>) {
        if (this.searchOptions !== searchOptions) {
            this.searchOptions = searchOptions
            this.search()
        }
    }

    public search() {
        if (this.searchString && this.searchOptions) {
            this.resultMap = {}
            this.fuse = new Fuse<T>(this.source.items(), this.searchOptions)
            this.results = this.fuse.search(this.searchString)

            // this.results = this.source.items().map((item) => {
            //     const key = this.source.getKey(item)

            //     const fuse = new Fuse<T>([item], this.searchOptions)
            //     fuse.search(this.searchString)
            //     const result = { value: 0, item }
            //     if (this.resultMap) this.resultMap[key] = result
            //     return result
            // })

            this.orderedEvent()
        } else {
            this.fuse = undefined
            // TODO reconcile and send events...
            this.results = undefined
            this.resultMap = undefined
            this.orderedEvent()
        }
    }

    // TODO - asynchronous search with cancel...
    handleChange(change: CollectionChange<T>) {
        this.pauseEvents()
        if (this.results && this.resultMap && this.fuse) {
            let sortNeeded = false

            for (const key in change?.inserted) {
                const item = change.inserted[key]
                let result = this.resultMap[key]
                if (result) {
                    // TODO update Search Result
                    result.item = item
                    // if( resultChanged ) sortNeeded = true
                } else {
                    if (this.searchString) {
                        this.fuse.add(item)
                        const results = this.fuse.search(this.searchString)
                        result = results[0]
                        this.fuse.removeAt(0)
                    }
                    this.resultMap[key] = result
                    this.results.push(result)
                    sortNeeded = true
                }

                // TODO handle if item does not pass search
                this.insertEvent(key, item)
            }

            if (change.removed) {
                this.results.filter((result) => {
                    const key = this.source.getKey(result.item)
                    let removed = false
                    if (change.removed?.[key] === true) {
                        if (this.resultMap?.[key]) {
                            if (this.resultMap) delete this.resultMap[key]
                            this.removeEvent(key)
                            removed = true
                        }
                    }
                    return !removed
                })
            }

            if (sortNeeded) {
                this.results.sort((l, r) => compareNumbers(l.score, r.score))
            }
        } else {
            for (const key in change.inserted) {
                this.insertEvent(key, change.inserted[key])
            }
            for (const key in change.removed) {
                this.removeEvent(key)
            }
        }

        this.resumeEvents()
    }

    public items(): ReadonlyArray<Readonly<T>> {
        if (this.results) {
            return this.results.map((searchResult) => searchResult.item)
        } else {
            return this.source.items()
        }
    }
}

export function useSearchedCollection<T>(
    source: ICollection<T>,
    search: string,
    searchOptions: Fuse.IFuseOptions<T>
): SearchedCollection<T> {
    const searchedRef = useRef({ searched: new SearchedCollection<T>(source) })
    useEffect(() => searchedRef.current.searched.setSearchOptions(searchOptions), [searchOptions])
    useEffect(() => searchedRef.current.searched.setSearch(search), [search])
    useEffect(() => () => searchedRef.current.searched.dispose(), [])
    return searchedRef.current.searched
}
