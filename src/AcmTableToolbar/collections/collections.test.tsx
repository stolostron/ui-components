/* Copyright Contributors to the Open Cluster Management project */

import { Collection, CollectionChange } from './collection'
import { FilteredCollection } from './filtered-collection'
import { PagedCollection } from './paged-collection'
import { SearchedCollection } from './searched-collection'
import { SelectedCollection } from './selected-collection'
import { SortedCollection } from './sorted-collection'

describe('collections', () => {
    interface ITestObject {
        name: string
    }

    const collection = new Collection<ITestObject>((item) => item.name)
    let collectionEvents: CollectionChange<ITestObject>[] = []
    collection.on('change', (changes) => collectionEvents.push(changes))

    const filtered = new FilteredCollection(collection)
    let filteredEvents: CollectionChange<ITestObject>[] = []
    filtered.on('change', (changes) => filteredEvents.push(changes))

    const searched = new SearchedCollection(filtered)
    let searchedEvents: CollectionChange<ITestObject>[] = []
    searched.on('change', (changes) => searchedEvents.push(changes))

    const sorted = new SortedCollection(searched)
    let sortedEvents: CollectionChange<ITestObject>[] = []
    sorted.on('change', (changes) => sortedEvents.push(changes))

    const paged = new PagedCollection(sorted, 1, 10)
    let pagedEvents: CollectionChange<ITestObject>[] = []
    paged.on('change', (changes) => pagedEvents.push(changes))

    const selected = new SelectedCollection(collection)
    const selectedEvents: CollectionChange<ITestObject>[] = []
    selected.on('change', (changes) => selectedEvents.push(changes))

    const testObject: ITestObject = { name: 'a' }

    afterAll(() => {
        collection.dispose()
        filtered.dispose()
        searched.dispose()
        sorted.dispose()
        paged.dispose()
        selected.dispose()
    })

    test('insert item', () => {
        collection.insertItem(testObject)

        expect(collection.length).toEqual(1)
        expect(collection.includes(testObject)).toBeTruthy()
        expect(collectionEvents).toEqual([{ inserted: { [testObject.name]: testObject } }])
        collectionEvents = []

        expect(filtered.length).toEqual(1)
        expect(filtered.includes(testObject)).toBeTruthy()
        expect(filteredEvents).toEqual([{ inserted: { [testObject.name]: testObject } }])
        filteredEvents = []

        expect(searched.length).toEqual(1)
        expect(searchedEvents).toEqual([{ ordered: true }])
        searchedEvents = []

        expect(sorted.length).toEqual(1)
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        expect(paged.length).toEqual(1)
        expect(pagedEvents).toEqual([{ ordered: true }])
        pagedEvents = []

        expect(selected.length).toEqual(0)
        expect(searchedEvents).toEqual([])
    })

    test('remove item', () => {
        expect(collection.length).toEqual(1)

        collection.removeKey(testObject.name)

        expect(collection.length).toEqual(0)
        expect(collection.includes(testObject)).toBeFalsy()
        expect(collectionEvents).toEqual([{ removed: { [testObject.name]: testObject } }])
        collectionEvents = []

        expect(filtered.length).toEqual(0)
        expect(filtered.includes(testObject)).toBeFalsy()
        expect(filteredEvents).toEqual([{ removed: { [testObject.name]: testObject } }])
        filteredEvents = []

        expect(searched.length).toEqual(0)
        expect(searchedEvents).toEqual([{ ordered: true }])
        searchedEvents = []

        expect(sorted.length).toEqual(0)
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        expect(paged.length).toEqual(0)
        expect(pagedEvents).toEqual([{ ordered: true }])
        pagedEvents = []

        expect(selected.length).toEqual(0)
        expect(searchedEvents).toEqual([])
    })
})

describe('filtered collection', () => {
    test('filters items', () => {
        const collection = new Collection<number>((n) => n.toString())
        for (let i = 1; i <= 9; i++) collection.insertItem(i)

        const filtered = new FilteredCollection(collection, (n) => n <= 4)
        expect(filtered.length).toEqual(4)
        expect(filtered.items()).toEqual([1, 2, 3, 4])
        let filteredEvents: CollectionChange<number>[] = []
        filtered.on('change', (changes) => filteredEvents.push(changes))

        filtered.setFilter(undefined)
        expect(filtered.length).toEqual(9)
        expect(filtered.items()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
        expect(filteredEvents).toEqual([{ inserted: { '5': 5, '6': 6, '7': 7, '8': 8, '9': 9 } }])
        filteredEvents = []

        filtered.setFilter((n) => n <= 4)
        expect(filtered.length).toEqual(4)
        expect(filtered.items()).toEqual([1, 2, 3, 4])
        expect(filteredEvents).toEqual([{ removed: { '5': 5, '6': 6, '7': 7, '8': 8, '9': 9 } }])
        filteredEvents = []
    })
})

describe('sorted collection', () => {
    test('sorts items', () => {
        const collection = new Collection<number>((n) => n.toString())
        for (let i = 1; i <= 9; i++) collection.insertItem(i)

        const sorted = new SortedCollection(collection)
        expect(sorted.items()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
        let sortedEvents: CollectionChange<number>[] = []
        sorted.on('change', (changes) => sortedEvents.push(changes))

        sorted.setSort((a, b) => a - b)
        expect(sorted.items()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        sorted.setSort((a, b) => b - a)
        expect(sorted.items()).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        collection.removeKey('5')
        expect(sorted.items()).toEqual([9, 8, 7, 6, 4, 3, 2, 1])
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        collection.insertItem(5)
        expect(sorted.items()).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []

        sorted.setSort(undefined)
        expect(sorted.items()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
        expect(sortedEvents).toEqual([{ ordered: true }])
        sortedEvents = []
    })
})

describe('paged collection', () => {
    test('pages items', () => {
        const collection = new Collection<number>((n) => n.toString())
        for (let i = 1; i <= 9; i++) collection.insertItem(i)

        const paged = new PagedCollection(collection, 1, 3)
        expect(paged.length).toEqual(3)
        expect(paged.items()).toEqual([1, 2, 3])
        let pagedEvents: CollectionChange<number>[] = []
        paged.on('change', (changes) => pagedEvents.push(changes))

        paged.setPage(2, 3)
        expect(paged.length).toEqual(3)
        expect(paged.items()).toEqual([4, 5, 6])
        expect(pagedEvents).toEqual([{ ordered: true }])
        pagedEvents = []

        paged.setPage(3, 2)
        expect(paged.length).toEqual(2)
        expect(paged.items()).toEqual([5, 6])
        expect(pagedEvents).toEqual([{ ordered: true }])
        pagedEvents = []

        paged.setPage(5, 2)
        expect(paged.length).toEqual(1)
        expect(paged.items()).toEqual([9])
        expect(pagedEvents).toEqual([{ ordered: true }])
        pagedEvents = []
    })
})
