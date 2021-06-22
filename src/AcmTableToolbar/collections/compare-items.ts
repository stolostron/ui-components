export type CompareFn<T> = (lhs: T, rhs: T) => number

export function compareItems(a?: unknown, b?: unknown): number {
    if (a === b) return 0
    if (a === undefined) return 1
    if (b === undefined) return -1

    if (typeof a === 'string') {
        if (typeof b === 'string') {
            return compareStrings(a, b)
        } else if (typeof b === 'number') {
            return compareStrings(a, b.toString())
        }
    } else if (typeof a === 'number') {
        if (typeof b === 'number') {
            return compareNumbers(a, b)
        } else if (typeof b === 'string') {
            return compareStrings(a.toString(), b)
        }
    }
    return 0
}

export function compareStrings(a?: string, b?: string): number {
    if (a === b) return 0
    if (a === undefined) return 1
    if (b === undefined) return -1
    return a < b ? -1 : a > b ? 1 : 0
}

export function compareNumbers(a?: number, b?: number): number {
    if (a === b) return 0
    if (a === undefined) return 1
    if (b === undefined) return -1
    return a < b ? 1 : a > b ? -1 : 0
}
