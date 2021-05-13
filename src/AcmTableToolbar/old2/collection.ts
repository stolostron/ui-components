import EventEmitter from 'events'

export interface CollectionChange<T> {
    added?: Record<string, T>
    removed?: Record<string, T>
    replaced?: Record<string, { item: T; existing: T }>
}

export declare interface Collection<T> {
    on(event: 'change', listener: (changeEvent: CollectionChange<T>) => void): this
}

export class Collection<T> extends EventEmitter {
    constructor(public readonly getKey: (item: T) => string, private readonly debounce?: number) {
        super()
    }

    readonly itemMap: Record<string, T> = {}
    private event: CollectionChange<T> | undefined
    private timeout: NodeJS.Timeout | undefined

    push(item: T) {
        const key = this.getKey(item)
        const existing = this.itemMap[key]
        if (existing === item) return
        this.itemMap[key] = item

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

    pop(key: string) {
        const existing = this.itemMap[key]
        if (existing !== undefined) {
            delete this.itemMap[key]
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

    public keys(): Readonly<string[]> {
        return Object.keys(this.itemMap)
    }

    public value(key: string): Readonly<T> {
        return this.itemMap[key]
    }

    public items(): Readonly<T[]> {
        return Object.values(this.itemMap)
    }

    sendEvent(immediate = false) {
        if (!this.event) return
        if (this.isPaused) return
        if (!immediate && this.debounce) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.timeout = undefined
                    const event = this.event
                    this.event = undefined
                    try {
                        this.emit('change', event)
                    } catch {
                        /* Do nothing */
                    }
                }, this.debounce)
            }
        } else {
            const event = this.event
            this.event = undefined
            this.emit('change', event)
        }
    }

    isPaused = false
    pause() {
        this.isPaused = true
    }

    resume() {
        this.isPaused = false
        this.sendEvent(true)
    }
}
