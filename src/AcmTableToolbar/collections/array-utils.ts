export function sortedIndex<T = unknown>(
    array: T[],
    item: Readonly<T>,
    compare: (lhs: Readonly<T>, rhs: Readonly<T>) => number
): number {
    let low = 0,
        high = array.length

    while (low < high) {
        const mid = (low + high) >>> 1
        if (compare(array[mid], item) < 0) low = mid + 1
        else high = mid
    }
    return low
}

export function sortedInsert<T = unknown>(
    array: T[],
    item: Readonly<T>,
    compare: (lhs: Readonly<T>, rhs: Readonly<T>) => number
) {
    const index = sortedIndex(array, item, compare)
    array.splice(index, 0, item)
}

export function sortedRemove<T = unknown>(
    array: T[],
    item: Readonly<T>,
    compare: (lhs: Readonly<T>, rhs: Readonly<T>) => number
) {
    const index = sortedIndex(array, item, compare)
    if (index >= array.length) return false
    array.splice(index, 1)
    return true
}

export function sortedReplace<T = unknown>(
    array: T[],
    item: Readonly<T>,
    compare: (lhs: Readonly<T>, rhs: Readonly<T>) => number
) {
    const index = sortedIndex(array, item, compare)
    if (index >= array.length) {
        array.splice(index, 0, item)
        return false
    }
    const existing = array[index]
    if (compare(existing, item) === 0) {
        array[index] = item
        return true
    } else {
        array.splice(index, 0, item)
        return false
    }
}
