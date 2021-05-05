import EventEmitter from 'events'

// declare interface Collection<T> {
//     on(event: 'hello', listener: (name: string) => void): this
//     on(event: string, listener: Function): this
// }
export interface CollectionEvent<T> {
    added?: Record<string, T>
    removed?: Record<string, T>
    replaced?: Record<string, { item: T; existing: T }>
}

export class Collection<T> extends EventEmitter {
    constructor(private getKey: (item: T) => string) {
        super()
    }

    readonly items: Record<string, T> = {}
    private event: CollectionEvent<T> | undefined
    public debounce: number | undefined
    private timeout: NodeJS.Timeout | undefined

    update(item: T) {
        const key = this.getKey(item)
        const existing = this.items[key]
        this.items[key] = item

        if (!this.event) this.event = {}
        if (existing !== undefined) {
            if (this.event.added && this.event.added[key]) {
                this.event.added[key] = item
            } else {
                if (!this.event.replaced) this.event.replaced = {}
                const existingReplace = this.event.replaced[key]
                if (existingReplace) {
                    this.event.replaced[key] = {
                        item,
                        existing: existingReplace.existing,
                    }
                } else {
                    this.event.replaced[key] = { item, existing }
                }
            }
        } else {
            if (!this.event.added) this.event.added = {}
            this.event.added[key] = item
        }

        this.sendEvent()
    }

    delete(key: string) {
        const existing = this.items[key]
        if (existing !== undefined) {
            delete this.items[key]
            if (!this.event) this.event = {}
            if (this.event.added && this.event.added[key]) {
                delete this.event.added[key]
            } else if (this.event.replaced && this.event.replaced[key]) {
                delete this.event.replaced[key]
            } else {
                if (!this.event.removed) this.event.removed = {}
                this.event.removed[key] = existing
            }
        }

        this.sendEvent()
    }

    sendEvent() {
        if (this.debounce) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.timeout = undefined
                    this.emit('change', this.event)
                    this.event = {}
                }, this.debounce)
            }
        } else {
            this.emit('change', this.event)
            this.event = {}
        }
    }
}

// function useCollection<T>(items: T[], getKey: KeyFn<T>) {
//     const [changes, setChanges] = useState<ItemChanges<T>>({})
//     const [existingKeys, setExistingKeys] = useState<Record<string, T>>({})
//     useEffect(() => {
//         const changes: ItemChanges<T> = {}
//         const itemKeys: Record<string, T> = {}
//         for (const item of items) {
//             const key = getKey(item)
//             itemKeys[key] = item
//             const existing = existingKeys[key]
//             if (!existing) {
//                 if (!changes.added) changes.added = []
//                 changes.added.push({ key, added: item })
//             } else {
//                 if (existing !== item) {
//                     if (!changes.replaced) changes.replaced = []
//                     changes.replaced.push({ key, item, replaced: existing })
//                 }
//             }
//         }
//         for (const key in existingKeys) {
//             if (!itemKeys[key]) {
//                 if (!changes.removed) changes.removed = []
//                 changes.removed.push({ key, removed: existingKeys[key] })
//             }
//         }
//         if (changes.added || changes.removed || changes.replaced) {
//             setExistingKeys(itemKeys)
//             setChanges(changes)
//         }
//     }, [items])
//     return changes
// }
